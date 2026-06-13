package com.placement.config;

import com.placement.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(sm -> sm
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // Public endpoints (no token needed)
                        .requestMatchers("/api/ping").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/students/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/companies/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admins/create").permitAll()

                        // STUDENT endpoints
                        .requestMatchers(HttpMethod.GET,  "/api/students/{id}").hasAnyRole("STUDENT","ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/students/{id}").hasAnyRole("STUDENT","ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/applications/apply").hasAnyRole("STUDENT","ADMIN")
                        .requestMatchers(HttpMethod.GET,  "/api/applications/student/**").hasAnyRole("STUDENT","ADMIN")
                        // Resume & Profile
                        .requestMatchers(HttpMethod.POST, "/api/students/*/resume").hasAnyRole("STUDENT","ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/students/*/profile").hasAnyRole("STUDENT","ADMIN")
                        .requestMatchers(HttpMethod.GET,  "/api/students/*/profile").hasAnyRole("STUDENT","ADMIN")

                        // COMPANY endpoints
                        .requestMatchers(HttpMethod.GET, "/api/companies/{id}").hasAnyRole("COMPANY","ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/applications/drive/**").hasAnyRole("COMPANY","ADMIN")

                        // ADMIN-only endpoints
                        .requestMatchers(HttpMethod.GET,  "/api/students").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,  "/api/companies").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/companies/{id}/approve").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/companies/{id}/reject").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/drives").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/drives/{id}/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/applications/{id}/status").hasRole("ADMIN")
                        // Admin Dashboard
                        .requestMatchers(HttpMethod.GET,  "/api/admin/dashboard").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/drives/**").authenticated()

                        .anyRequest().authenticated()
                )

                // Register our JWT filter before Spring's default auth filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}