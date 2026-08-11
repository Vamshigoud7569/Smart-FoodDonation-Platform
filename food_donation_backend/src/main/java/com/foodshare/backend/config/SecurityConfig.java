package com.foodshare.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:8000",
                "http://127.0.0.1:5500"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
    {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth ->
                auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/files/**").permitAll()
                .requestMatchers("/FoodDonation/registration", "/FoodDonation/login").permitAll()
                .requestMatchers(HttpMethod.POST,"/FoodDonation/postdonation").hasRole("DONOR")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/activedonations").hasRole("DONOR")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/analytics").hasRole("DONOR")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/mydonations").hasRole("DONOR")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/profiledonor").hasRole("DONOR")
                .requestMatchers(HttpMethod.PUT,"/FoodDonation/profile").hasAnyRole("DONOR","NGO","REQUESTER","VOLUNTEER")
                .requestMatchers(HttpMethod.POST,"/FoodDonation/updatepassword").hasAnyRole("DONOR","NGO","VOLUNTEER","REQUESTER")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/donor/requests").hasRole("DONOR")
                .requestMatchers(HttpMethod.PATCH,"/FoodDonation/donor/requests/**").hasRole("DONOR")
                .requestMatchers(HttpMethod.POST,"/FoodDonation/verification").hasAnyRole("REQUESTER","NGO","DONOR","VOLUNTEER")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/verification/me").hasAnyRole("NGO","REQUESTER","VOLUNTEER","DONOR")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/adminDashboard").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,"/FoodDonation/adminDashboard/submitAdminStatus").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/profilerecipient").hasAnyRole("NGO","REQUESTER")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/recipientDashboard").hasAnyRole("NGO","REQUESTER")
                .requestMatchers(HttpMethod.POST,"/FoodDonation/requestdonation").hasAnyRole("NGO","REQUESTER")
                .requestMatchers(HttpMethod.GET,"/FoodDonation/volunteer/**").hasRole("VOLUNTEER")
                .requestMatchers(HttpMethod.POST,"/FoodDonation/volunteer/**").hasRole("VOLUNTEER")
                .requestMatchers(HttpMethod.PATCH,"/FoodDonation/volunteer/**").hasRole("VOLUNTEER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
