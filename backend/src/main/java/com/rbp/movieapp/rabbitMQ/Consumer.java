package com.rbp.movieapp.rabbitMQ;

import com.rbp.movieapp.models.Movie;
import com.rbp.movieapp.models.Ticket;
import com.rbp.movieapp.security.services.MovieService;
import org.bson.types.ObjectId;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Consumer {

    @Autowired
    private MovieService movieService;

    @RabbitListener(queues = "communicationQueue")
    private void updateAvailableTickectsInMovie(Ticket ticket) {
        ObjectId objectId = movieService.findAvailableTickets(ticket.getMovieName(),ticket.getTheatreName()).get(0).get_id();
        System.out.println("------------>"+ticket.toString());
        Movie movie = new Movie(
                objectId,
                ticket.getMovieName(),
                ticket.getTheatreName(),

                movieService.findAvailableTickets(ticket.getMovieName(),ticket.getTheatreName()).get(0).getNoOfTicketsAvailable() - ticket.getNoOfTickets(),
       ticket.getTicketStatus()
        );
        System.out.println("------------>"+movie.toString());
        movieService.saveMovie(movie);
    }
}
