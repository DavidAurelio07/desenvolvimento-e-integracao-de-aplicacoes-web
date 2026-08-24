package com.example.ClimaAPI.controller;

import com.example.ClimaAPI.service.ResponseDTO;
import com.example.ClimaAPI.service.ClimaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/clima")
public class Controller {

    @Autowired
    private ClimaService Service;

    @GetMapping
    public ResponseDTO getClima() {
        return Service.obterClima();
    }
}