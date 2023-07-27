package com.rbp.movieapp.rabbitMQ;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConversionException;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageConfig {
 public static String rabbitMqQueue="communicationQueue";
    public static String rabbitMqExcahnge="communicationExchange";
    public static String rabbitMqRoutingKey="routing_key";

    @Bean
    public Queue queue(){
        return new Queue(rabbitMqQueue);
    }

    @Bean
    public TopicExchange exchange(){
        return new TopicExchange(rabbitMqExcahnge);
    }

    @Bean
    public Binding binging(Queue q,TopicExchange topicExchange){
        return BindingBuilder.bind(q).to(topicExchange).with(rabbitMqRoutingKey);
    }

    @Bean
    public MessageConverter converter(){
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate template(ConnectionFactory cf){
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(cf);
        rabbitTemplate.setMessageConverter(converter());
        return rabbitTemplate;

    }
}
