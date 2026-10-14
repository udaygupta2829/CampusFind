package com.campusfind.service.impl;

import com.campusfind.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:noreply@campusfind.college.edu}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendClaimStatusUpdate(String toEmail, String studentName, String itemName, String status, String notes) {
        String subject = "CampusFind Update: Your Claim for '" + itemName + "' is " + status;
        String content = "Hello " + studentName + ",\n\n"
                + "Your ownership claim for the item '" + itemName + "' has been updated to: " + status + ".\n\n"
                + (notes != null && !notes.isBlank() ? "Admin Notes: " + notes + "\n\n" : "")
                + "Please log in to your CampusFind portal to view full details and pickup instructions.\n\n"
                + "Best regards,\nCampusFind Security & Admin Team";

        sendEmail(toEmail, subject, content);
    }

    @Override
    public void sendPossibleMatchNotification(String toEmail, String studentName, String lostItemName, String foundItemName) {
        String subject = "CampusFind: Possible Match Found for '" + lostItemName + "'";
        String content = "Hello " + studentName + ",\n\n"
                + "A recently reported found item ('" + foundItemName + "') might match your lost report for '" + lostItemName + "'.\n\n"
                + "Please log in to your CampusFind dashboard to review this suggested match and submit an ownership claim if it is yours.\n\n"
                + "Best regards,\nCampusFind Team";

        sendEmail(toEmail, subject, content);
    }

    @Override
    public void sendItemReturnConfirmation(String toEmail, String studentName, String itemName, String location) {
        String subject = "CampusFind: Item Return Confirmation - '" + itemName + "'";
        String content = "Hello " + studentName + ",\n\n"
                + "This confirms that the item '" + itemName + "' has been successfully handed over to you at " + location + ".\n\n"
                + "Thank you for using CampusFind!\n\n"
                + "Best regards,\nCampusFind Security & Admin Team";

        sendEmail(toEmail, subject, content);
    }

    private void sendEmail(String to, String subject, String body) {
        log.info("[EMAIL NOTIFICATION] To: {}, Subject: {}", to, subject);
        if (!mailEnabled) {
            log.info("[EMAIL NOTIFICATION SIMULATION] Body:\n{}", body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email successfully sent to {}", to);
        } catch (Exception ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }
}
