package com.example.springinventory;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration // Marks this class as a source of bean definitions
@EnableWebSecurity // Enables Spring Security's web security support
public class SecurityConfig {

    // 1. Configure who can access what endpoints
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (Cross Site Request Forgery) protection to simplify API testing
                // via curl/postman
                // In a real app with a browser frontend, you'd likely keep this enabled or use
                // tokens.
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Allow anyone (public access) to do GET requests to /api/inventory (viewing
                        // items)
                        .requestMatchers(HttpMethod.GET, "/api/inventory/**").permitAll()
                        // Allow anyone to access the static frontend files
                        .requestMatchers("/", "/index.html", "/index.css", "/app.js").permitAll()
                        // Require authentication for ALL other requests (like POST to add or purchase
                        // items)
                        .anyRequest().authenticated())
                // Enable HTTP Basic Authentication (sending credentials in the header)
                .httpBasic(withDefaults());

        return http.build();
    }

    // 2. Configure our users (In-Memory for this demo)
    @Bean
    public UserDetailsService userDetailsService() {
        PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

        // Create an admin user
        UserDetails admin = User.builder()
                .username("admin")
                .password(encoder.encode("password"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }
}
