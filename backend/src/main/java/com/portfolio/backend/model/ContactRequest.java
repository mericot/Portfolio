package com.portfolio.backend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequest {

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "email is required")
    @Email(message = "email must be a valid email address")
    private String email;

    @NotBlank(message = "message is required")
    @Size(max = 500, message = "message must be at most 500 characters")
    private String message;

    @NotBlank(message = "subject is required")
    @Size(max = 120, message = "subject must be at most 120 characters")
    private String subject;

    public ContactRequest() {
    }

    public ContactRequest(String name, String email, String message, String subject) {
        this.name = name;
        this.email = email;
        this.message = message;
        this.subject = subject;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}
