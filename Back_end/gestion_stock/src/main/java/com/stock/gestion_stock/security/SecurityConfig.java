package com.stock.gestion_stock.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Endpoints publics
                        .requestMatchers("/api/auth/**").permitAll()

                        // Gestion des utilisateurs — ADMIN seulement
                        .requestMatchers("/api/utilisateurs/**").hasRole("ADMIN")

                        // Produits : lecture pour tous les authentifiés, écriture pour ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/produits/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/produits/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/produits/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/produits/**").hasRole("ADMIN")

                        // Fournisseurs : lecture pour tous, écriture pour ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/fournisseurs/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/fournisseurs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/fournisseurs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/fournisseurs/**").hasRole("ADMIN")

                        // Mouvements : lecture et écriture pour tous les authentifiés
                        .requestMatchers("/api/mouvements/**").authenticated()

                        // Stats : accessible à tous les authentifiés
                        .requestMatchers("/api/stats/**").authenticated()

                        // Tout le reste nécessite une authentification
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
