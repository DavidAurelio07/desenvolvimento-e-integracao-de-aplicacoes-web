package com.example.ClimaAPI.service;

import com.example.ClimaAPI.service.ResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ClimaService {

    public ResponseDTO obterClima() {
        String apiKey = "66c35a2314884161b1c105312262408"; 
        String url = "https://api.weatherapi.com/v1/forecast.json?key=" + apiKey + "&q=Belo Horizonte&days=1&lang=pt";

        RestTemplate restTemplate = new RestTemplate();
        Map response = restTemplate.getForObject(url, Map.class);

        Map location = (Map) response.get("location");
        Map current = (Map) response.get("current");
        Map condition = (Map) current.get("condition");
        Map forecast = (Map) response.get("forecast");
        List forecastday = (List) forecast.get("forecastday");
        Map diaZero = (Map) forecastday.get(0);
        Map day = (Map) diaZero.get("day");

        String cidade = location.get("name") + " - " + location.get("region");
        Double temp = Double.valueOf(current.get("temp_c").toString());
        Integer umidade = Integer.valueOf(current.get("humidity").toString());
        Double vento = Double.valueOf(current.get("wind_kph").toString());
        Integer direcao = Integer.valueOf(current.get("wind_degree").toString());
        String condicaoTexto = condition.get("text").toString();
        String dataHora = current.get("last_updated").toString();

        Double tempMax = Double.valueOf(day.get("maxtemp_c").toString());
        Double tempMin = Double.valueOf(day.get("mintemp_c").toString());

        return new ResponseDTO(cidade, temp, umidade, vento, direcao, condicaoTexto, tempMax, tempMin, dataHora);
    }
}