package com.example.ClimaAPI.service;

public class ResponseDTO {
    public String cidade;
    public Double temperaturaAtual;
    public Integer umidadeAr;
    public Double velocidadeVento;
    public Integer direcaoVento;
    public String condicaoClimatica;
    public Double temperaturaMaxima;
    public Double temperaturaMinima;
    public String dataHoraConsulta;

    public ResponseDTO(String cidade, Double temperaturaAtual, Integer umidadeAr, Double velocidadeVento, 
                            Integer direcaoVento, String condicaoClimatica, Double temperaturaMaxima, 
                            Double temperaturaMinima, String dataHoraConsulta) {
        this.cidade = cidade;
        this.temperaturaAtual = temperaturaAtual;
        this.umidadeAr = umidadeAr;
        this.velocidadeVento = velocidadeVento;
        this.direcaoVento = direcaoVento;
        this.condicaoClimatica = condicaoClimatica;
        this.temperaturaMaxima = temperaturaMaxima;
        this.temperaturaMinima = temperaturaMinima;
        this.dataHoraConsulta = dataHoraConsulta;
    }
}