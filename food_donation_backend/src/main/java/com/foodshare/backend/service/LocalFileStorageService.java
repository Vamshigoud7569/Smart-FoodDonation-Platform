package com.foodshare.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.foodshare.backend.enumTypes.FileStorageService;



@Service
public class LocalFileStorageService implements FileStorageService {

    private final java.nio.file.Path uploadDir;
    private final String baseUrl;

    public LocalFileStorageService(
            @Value("${app.upload.dir}") String uploadDirPath,
            @Value("${app.upload.base-url}") String baseUrl) {
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        this.baseUrl = baseUrl;
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        validate(file);

        String extension = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;
        java.nio.file.Path target = uploadDir.resolve(filename);

        try {
            file.transferTo(target);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        return baseUrl + "/" + filename;
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        String contentType = file.getContentType();
        boolean allowed = contentType != null &&
            (contentType.equals("application/pdf")
                || contentType.equals("image/jpeg")
                || contentType.equals("image/png"));
        if (!allowed) {
            throw new IllegalArgumentException("Only PDF, JPEG, or PNG files are allowed");
        }
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) return "";
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
}