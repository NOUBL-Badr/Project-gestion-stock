package com.stock.gestion_stock.controller;

import com.stock.gestion_stock.dto.StatsDTO;
import com.stock.gestion_stock.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    
    // GET /api/stats — Récupère les statistiques du tableau de bord
    
    @GetMapping
    public ResponseEntity<StatsDTO> getStats() {
        return ResponseEntity.ok(statsService.getStats());
    }
}
