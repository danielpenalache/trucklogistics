package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"camiones/backend/handlers"

	"github.com/jung-kurt/gofpdf"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/genai"
)

const (
	MONGO_URI       = "mongodb+srv://danielpena:h27l3als3SEGZjNZ@facial-auth-cluster.2m0h9gm.mongodb.net/shipment_management?retryWrites=true&w=majority&appName=facial-auth-cluster"
	LOCAL_MONGO_URI = "mongodb://localhost:27017/shipment-management"
)

func generateTrackingNumber() string {
	return fmt.Sprintf("TN-%d", time.Now().UnixNano())
}

func main() {
	// Conexión a MongoDB Atlas
	clientOptions := options.Client().ApplyURI(MONGO_URI)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatalf("Error al conectar con MongoDB Atlas: %v", err)
	}
	defer client.Disconnect(context.TODO())

	// Verificar conexión a MongoDB Atlas
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatalf("Error al verificar la conexión con MongoDB Atlas: %v", err)
	}
	fmt.Println("Conexión a MongoDB Atlas establecida exitosamente")

	// Conexión a MongoDB local (Compass)
	localClientOptions := options.Client().ApplyURI(LOCAL_MONGO_URI)
	localClient, err := mongo.Connect(context.TODO(), localClientOptions)
	if err != nil {
		log.Printf("Error al conectar con MongoDB local: %v", err)
		log.Println("Continuando sin conexión local...")
		localClient = nil
	} else {
		// Verificar conexión local
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		err = localClient.Ping(ctx, nil)
		if err != nil {
			log.Printf("Error al verificar la conexión con MongoDB local: %v", err)
			log.Println("Continuando sin conexión local...")
			localClient = nil
		} else {
			fmt.Println("Conexión a MongoDB local establecida exitosamente")
			defer localClient.Disconnect(context.TODO())
		}
	}

	db := client.Database("shipment_management")
	var localDB *mongo.Database
	if localClient != nil {
		localDB = localClient.Database("shipment_management")
	}

	// Crear índice único para el email
	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true),
	}
	_, err = db.Collection("users").Indexes().CreateOne(context.TODO(), indexModel)
	if err != nil {
		log.Printf("Error al crear índice para email: %v", err)
	}

	// Servir archivos PDF estáticos
	pdfDir := "./pdfs"
	if err := os.MkdirAll(pdfDir, 0755); err != nil {
		log.Printf("Error al crear directorio de PDFs: %v", err)
	}
	fs := http.FileServer(http.Dir(pdfDir))
	http.Handle("/pdfs/", http.StripPrefix("/pdfs/", fs))

	http.HandleFunc("/register-shipment", func(w http.ResponseWriter, r *http.Request) {
		trackingNumber := generateTrackingNumber()
		shipmentType := r.FormValue("shipmentType")
		shipmentDescription := r.FormValue("shipmentDescription")
		trucker := r.FormValue("trucker")
		originCity := r.FormValue("originCity")
		destinationCity := r.FormValue("destinationCity")
		status := r.FormValue("status")
		consignorName := r.FormValue("consignorName")
		consigneeName := r.FormValue("consigneeName")

		if shipmentType == "" || shipmentDescription == "" || trucker == "" || originCity == "" || destinationCity == "" || status == "" || consignorName == "" || consigneeName == "" {
			http.Error(w, "Por favor, complete todos los campos.", http.StatusBadRequest)
			return
		}

		destinationAddress := r.FormValue("destinationAddress")
		if destinationAddress == "" {
			http.Error(w, "Por favor, ingrese la dirección de destino.", http.StatusBadRequest)
			return
		}

		shipment := bson.M{
			"tracking_number":      trackingNumber,
			"shipment_type":        shipmentType,
			"shipment_description": shipmentDescription,
			"trucker_id":           trucker,
			"origin_city":          originCity,
			"destination_city":     destinationCity,
			"destination_address":  destinationAddress,
			"status":               status,
			"consignor_name":       consignorName,
			"consignee_name":       consigneeName,
			"created_at":           time.Now(),
		}

		_, err := db.Collection("shipments").InsertOne(context.TODO(), shipment)
		if err != nil {
			http.Error(w, "Error al registrar el envío: "+err.Error(), http.StatusInternalServerError)
			log.Printf("Error al registrar el envío: %v", err)
			return
		}

		// Insertar también en la base local si está disponible
		if localDB != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			_, err = localDB.Collection("shipments").InsertOne(ctx, shipment)
			if err != nil {
				log.Printf("Error al insertar en la base local: %v", err)
				log.Println("El envío solo se guardó en MongoDB Atlas")
			} else {
				log.Println("Envío guardado exitosamente en la base local")
			}
		} else {
			log.Println("Base de datos local no disponible, el envío solo se guardó en MongoDB Atlas")
		}

		// Generar PDF
		pdf := gofpdf.New("P", "mm", "A4", "")
		pdf.AddPage()
		pdf.SetFont("Arial", "B", 16)
		pdf.Cell(190, 10, "Comprobante de Envío")
		pdf.Ln(20)

		pdf.SetFont("Arial", "", 12)
		pdf.Cell(190, 10, fmt.Sprintf("Número de Guía: %s", trackingNumber))
		pdf.Ln(10)
		pdf.Cell(190, 10, fmt.Sprintf("Tipo de Envío: %s", shipmentType))
		pdf.Ln(10)
		pdf.Cell(190, 10, fmt.Sprintf("Descripción: %s", shipmentDescription))
		pdf.Ln(10)
		pdf.Cell(190, 10, fmt.Sprintf("Ciudad Origen: %s", originCity))
		pdf.Ln(10)
		pdf.Cell(190, 10, fmt.Sprintf("Ciudad Destino: %s", destinationCity))
		pdf.Ln(10)
		pdf.Cell(190, 10, fmt.Sprintf("Dirección de Destino: %s", destinationAddress))
		pdf.Ln(10)
		pdf.Cell(190, 10, fmt.Sprintf("Estado: %s", status))
		pdf.Ln(10)
		pdf.Cell(190, 10, fmt.Sprintf("Remitente: %s", consignorName))
		pdf.Ln(10)
		pdf.Cell(190, 10, fmt.Sprintf("Destinatario: %s", consigneeName))

		pdfPath := fmt.Sprintf("pdfs/envio_%s.pdf", trackingNumber)
		err = pdf.OutputFileAndClose(pdfPath)
		if err != nil {
			log.Printf("Error al generar PDF: %v", err)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message":        "Registro de envío exitoso",
			"trackingNumber": trackingNumber,
			"pdfPath":        "/pdfs/envio_" + trackingNumber + ".pdf",
		})
	})

	http.HandleFunc("/register-trucker", func(w http.ResponseWriter, r *http.Request) {
		name := r.FormValue("name")
		identityNumber := r.FormValue("identityNumber")
		licenseNumber := r.FormValue("licenseNumber")

		for _, char := range name {
			if !((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char == ' ') {
				http.Error(w, "El nombre solo debe contener letras", http.StatusBadRequest)
				return
			}
		}

		for _, char := range identityNumber {
			if char < '0' || char > '9' {
				http.Error(w, "El número de identificación solo debe contener números", http.StatusBadRequest)
				return
			}
		}

		if len(licenseNumber) != 12 {
			http.Error(w, "El número de licencia debe tener exactamente 12 dígitos", http.StatusBadRequest)
			return
		}

		if name == "" || identityNumber == "" || licenseNumber == "" {
			http.Error(w, "Por favor, complete todos los campos.", http.StatusBadRequest)
			return
		}

		trucker := bson.M{
			"name":            name,
			"identity_number": identityNumber,
			"license_number":  licenseNumber,
			"created_at":      time.Now(),
		}

		_, err := db.Collection("truckers").InsertOne(context.TODO(), trucker)
		if err != nil {
			http.Error(w, "Error al registrar el camionero: "+err.Error(), http.StatusInternalServerError)
			log.Printf("Error al registrar el camionero: %v", err)
			return
		}

		// Insertar también en la base local si está disponible
		if localDB != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			_, err = localDB.Collection("truckers").InsertOne(ctx, trucker)
			if err != nil {
				log.Printf("Error al insertar camionero en la base local: %v", err)
				log.Println("El camionero solo se guardó en MongoDB Atlas")
			} else {
				log.Println("Camionero guardado exitosamente en la base local")
			}
		} else {
			log.Println("Base de datos local no disponible, el camionero solo se guardó en MongoDB Atlas")
		}

		fmt.Fprintf(w, "Registro de camionero exitoso")
	})

	http.HandleFunc("/register-user", func(w http.ResponseWriter, r *http.Request) {
		username := r.FormValue("username")
		password := r.FormValue("password")
		email := r.FormValue("email")
		if username == "" || password == "" || email == "" {
			http.Error(w, "Por favor, complete todos los campos.", http.StatusBadRequest)
			return
		}

		// Verificar si el usuario ya existe
		var existingUser bson.M
		err := db.Collection("users").FindOne(context.TODO(), bson.M{"username": username}).Decode(&existingUser)
		if err == nil {
			http.Error(w, "El nombre de usuario ya está registrado.", http.StatusConflict)
			return
		} else if err != mongo.ErrNoDocuments {
			http.Error(w, "Error al verificar el usuario: "+err.Error(), http.StatusInternalServerError)
			return
		}

		user := bson.M{
			"username":   username,
			"password":   password,
			"email":      email,
			"created_at": time.Now(),
		}

		_, err = db.Collection("users").InsertOne(context.TODO(), user)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				http.Error(w, "El correo electrónico ya está registrado.", http.StatusConflict)
				return
			}
			http.Error(w, "Error al registrar el usuario: "+err.Error(), http.StatusInternalServerError)
			log.Printf("Error al registrar el usuario: %v", err)
			return
		}

		// Insertar también en la base local si está disponible
		if localDB != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			_, err = localDB.Collection("users").InsertOne(ctx, user)
			if err != nil {
				log.Printf("Error al insertar usuario en la base local: %v", err)
				log.Println("El usuario solo se guardó en MongoDB Atlas")
			} else {
				log.Println("Usuario guardado exitosamente en la base local")
			}
		} else {
			log.Println("Base de datos local no disponible, el usuario solo se guardó en MongoDB Atlas")
		}

		fmt.Fprintf(w, "Registro de usuario exitoso")
	})

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		username := r.FormValue("username")
		password := r.FormValue("password")

		if username == "" || password == "" {
			http.Error(w, "Por favor, complete todos los campos.", http.StatusBadRequest)
			return
		}

		// Verificar si el usuario existe
		var user bson.M
		err := db.Collection("users").FindOne(context.TODO(), bson.M{
			"username": username,
		}).Decode(&user)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, "El usuario no existe.", http.StatusUnauthorized)
				return
			}
			http.Error(w, "Error al verificar las credenciales.", http.StatusInternalServerError)
			return
		}

		// Verificar la contraseña
		if user["password"] != password {
			http.Error(w, "Contraseña incorrecta.", http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Inicio de sesión exitoso",
		})
	})

	http.HandleFunc("/truckers", func(w http.ResponseWriter, r *http.Request) {
		cursor, err := db.Collection("truckers").Find(context.TODO(), bson.M{})
		if err != nil {
			http.Error(w, "Error al obtener los camioneros: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer cursor.Close(context.TODO())

		var truckers []bson.M
		if err = cursor.All(context.TODO(), &truckers); err != nil {
			http.Error(w, "Error al procesar los camioneros: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Modificar la respuesta para incluir nombre e ID
		var formattedTruckers []map[string]interface{}
		for _, trucker := range truckers {
			formattedTrucker := map[string]interface{}{
				"_id":             trucker["_id"],
				"display_name":    fmt.Sprintf("%v (Identificación: %v)", trucker["name"], trucker["identity_number"]),
				"name":            trucker["name"],
				"identity_number": trucker["identity_number"],
				"license_number":  trucker["license_number"],
			}
			formattedTruckers = append(formattedTruckers, formattedTrucker)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(formattedTruckers)
	})

	http.HandleFunc("/shipment/", func(w http.ResponseWriter, r *http.Request) {
		trackingNumber := r.URL.Path[len("/shipment/"):]

		if trackingNumber == "" {
			http.Error(w, "Número de guía no proporcionado", http.StatusBadRequest)
			return
		}

		var shipment bson.M
		err := db.Collection("shipments").FindOne(context.TODO(), bson.M{
			"tracking_number": trackingNumber,
		}).Decode(&shipment)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, "No se encontró el envío con ese número de guía", http.StatusNotFound)
			} else {
				http.Error(w, "Error al buscar el envío: "+err.Error(), http.StatusInternalServerError)
				log.Printf("Error al buscar el envío: %v", err)
			}
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(shipment)
	})

	http.HandleFunc("/update-shipment-status", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
			return
		}

		trackingNumber := r.FormValue("trackingNumber")
		newStatus := r.FormValue("newStatus")

		if trackingNumber == "" || newStatus == "" {
			http.Error(w, "Por favor, complete todos los campos.", http.StatusBadRequest)
			return
		}

		result, err := db.Collection("shipments").UpdateOne(
			context.TODO(),
			bson.M{"tracking_number": trackingNumber},
			bson.M{"$set": bson.M{"status": newStatus}},
		)

		if err != nil {
			http.Error(w, "Error al actualizar el estado del envío: "+err.Error(), http.StatusInternalServerError)
			log.Printf("Error al actualizar el estado del envío: %v", err)
			return
		}

		if result.MatchedCount == 0 {
			http.Error(w, "No se encontró el envío con ese número de guía", http.StatusNotFound)
			return
		}

		fmt.Fprintf(w, "Estado del envío actualizado correctamente")
	})

	http.HandleFunc("/check-email", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
			return
		}

		email := r.URL.Query().Get("email")
		if email == "" {
			http.Error(w, "Email no proporcionado", http.StatusBadRequest)
			return
		}

		var existingUser bson.M
		err := db.Collection("users").FindOne(context.TODO(), bson.M{"email": email}).Decode(&existingUser)

		w.Header().Set("Content-Type", "application/json")
		if err == mongo.ErrNoDocuments {
			json.NewEncoder(w).Encode(map[string]bool{"exists": false})
			return
		} else if err != nil {
			http.Error(w, "Error al verificar el correo electrónico", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]bool{"exists": true})
	})

	http.HandleFunc("/colombian-locations", handlers.GetColombianLocations)

	http.HandleFunc("/estimate-time", handleGeminiEstimate)

	handler := cors.AllowAll().Handler(http.DefaultServeMux)
	http.ListenAndServe(":8080", handler)
}

func handleGeminiEstimate(w http.ResponseWriter, r *http.Request) {
	origin := r.URL.Query().Get("origin")
	destination := r.URL.Query().Get("destination")

	if origin == "" || destination == "" {
		http.Error(w, "Por favor, proporcione las ciudades de origen y destino.", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  os.Getenv("GEMINI_API_KEY"),
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		http.Error(w, "Error al crear el cliente de Gemini: "+err.Error(), http.StatusInternalServerError)
		return
	}

	result, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.0-flash",
		genai.Text(fmt.Sprintf("Responde cuanto tarda un envio en un camion promedio con la via un poco congestionada de %s a %s en Colombia. Responde en español y solo dime las horas estimadas.", origin, destination)),
		nil,
	)
	if err != nil {
		http.Error(w, "Error al consultar la API de Gemini: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"estimated_time": result.Text(),
	})
}
