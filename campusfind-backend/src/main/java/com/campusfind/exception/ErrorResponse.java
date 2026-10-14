package com.campusfind.exception;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {
    private boolean success;
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> validationErrors;

    public ErrorResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private boolean success;
        private int status;
        private String error;
        private String message;
        private LocalDateTime timestamp;
        private Map<String, String> validationErrors;

        public Builder success(boolean success) { this.success = success; return this; }
        public Builder status(int status) { this.status = status; return this; }
        public Builder error(String error) { this.error = error; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }
        public Builder validationErrors(Map<String, String> validationErrors) { this.validationErrors = validationErrors; return this; }

        public ErrorResponse build() {
            ErrorResponse e = new ErrorResponse();
            e.setSuccess(this.success);
            e.setStatus(this.status);
            e.setError(this.error);
            e.setMessage(this.message);
            e.setTimestamp(this.timestamp != null ? this.timestamp : LocalDateTime.now());
            e.setValidationErrors(this.validationErrors);
            return e;
        }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Map<String, String> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(Map<String, String> validationErrors) { this.validationErrors = validationErrors; }
}
