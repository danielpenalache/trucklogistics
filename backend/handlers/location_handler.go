package handlers

import (
	"io/ioutil"
	"net/http"
	"path/filepath"
)

type LocationData struct {
	Departments []struct {
		Name   string   `json:"name"`
		Cities []string `json:"cities"`
	} `json:"departments"`
}

func GetColombianLocations(w http.ResponseWriter, r *http.Request) {
	dataFile := filepath.Join("data", "colombia_cities.json")
	fileContent, err := ioutil.ReadFile(dataFile)
	if err != nil {
		http.Error(w, "Error al leer los datos de ubicaciones", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(fileContent)
}
