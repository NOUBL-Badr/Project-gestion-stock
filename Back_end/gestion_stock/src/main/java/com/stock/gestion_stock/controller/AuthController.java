package com.stock.gestion_stock.controller;

import com.stock.gestion_stock.dto.LoginRequest;
import com.stock.gestion_stock.dto.LoginResponse;
import com.stock.gestion_stock.dto.RegisterRequest;
import com.stock.gestion_stock.dto.UtilisateurDTO;
import com.stock.gestion_stock.model.Utilisateur;
import com.stock.gestion_stock.repository.UtilisateurRepository;
import com.stock.gestion_stock.security.JwtUtil;
import com.stock.gestion_stock.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurService utilisateurService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UtilisateurRepository utilisateurRepository,
                          UtilisateurService utilisateurService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.utilisateurRepository = utilisateurRepository;
        this.utilisateurService = utilisateurService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        Utilisateur utilisateur = utilisateurRepository.findByUsername(request.getUsername())
                .orElseThrow();

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .username(utilisateur.getUsername())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .role(utilisateur.getRole().name())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UtilisateurDTO> register(@Valid @RequestBody RegisterRequest request) {
        UtilisateurDTO created = utilisateurService.createUtilisateur(request);
        return ResponseEntity.ok(created);
    }
}
