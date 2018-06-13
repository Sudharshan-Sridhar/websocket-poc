package pac.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate template;

    @Autowired
    WebSocketController(SimpMessagingTemplate template){
        this.template = template;
    }

    @MessageMapping("/send/message")
    public void onReceivedMesage(HashMap<String, Object> message){
    	System.out.println(message);
    	message.put("timestamp", new SimpleDateFormat("HH:mm:ss").format(new Date()));
        this.template.convertAndSend("/chat",  message);
    }
}
