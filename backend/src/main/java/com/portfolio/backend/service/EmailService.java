package com.portfolio.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String contactRecipient;

    public EmailService(
            @Nullable JavaMailSender mailSender,
            @Value("${app.contact.recipient-email}") String contactRecipient) {
        this.mailSender = mailSender;
        this.contactRecipient = contactRecipient;
    }

    public void sendContactEmail(String name, String email, String message, String subject) {
        if (mailSender == null) {
            throw new IllegalStateException("Mail sender is not configured");
        }

        String body = String.format(
                "New Contact Message%n%nName: %s%nEmail: %s%nSubject: %s%nMessage:%n%s",
                name,
                email,
                subject,
                message);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(contactRecipient);
        mailMessage.setReplyTo(email);
        mailMessage.setSubject("New Contact Message - " + subject);
        mailMessage.setText(body);

        mailSender.send(mailMessage);
    }
}
