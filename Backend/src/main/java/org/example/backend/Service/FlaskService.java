package org.example.backend.service;

import org.example.backend.model.Investment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.HashMap;
import java.util.Map;

@Service
public class FlaskService {

    private final String FLASK_URL = "http://localhost:5000/predict";


    public Map<String, Object> analyzeInvestment(Investment investment) {
        RestTemplate restTemplate = new RestTemplate();

        // Prepare the request payload
        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("investmentType", investment.getInvestmentType());
        requestPayload.put("asset", investment.getAsset());
        requestPayload.put("amount", investment.getAmount());
        requestPayload.put("purchasePrice", investment.getPurchasePrice());
        requestPayload.put("purchaseDate", investment.getPurchaseDate().toString());
        requestPayload.put("currentValue", investment.getCurrentValue());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestPayload, headers);

        // Send POST to Flask and get response
        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_URL, request, Map.class);

        return response.getBody();
    }
}
