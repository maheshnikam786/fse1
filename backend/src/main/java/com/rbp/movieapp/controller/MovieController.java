package com.rbp.movieapp.controller;

import com.rbp.movieapp.exception.MoviesNotFound;
import com.rbp.movieapp.exception.SeatAlreadyBooked;
import com.rbp.movieapp.models.Movie;
import com.rbp.movieapp.security.jwt.JwtUtils;
import com.rbp.movieapp.models.Ticket;
import com.rbp.movieapp.models.User;
import com.rbp.movieapp.payload.request.LoginRequest;
import com.rbp.movieapp.rabbitMQ.MessageConfig;
import com.rbp.movieapp.repository.MovieRepository;
import com.rbp.movieapp.repository.TicketRepository;
import com.rbp.movieapp.repository.UserRepository;
import com.rbp.movieapp.security.jwt.JwtUtils;
import com.rbp.movieapp.security.services.MovieService;
import com.rbp.movieapp.security.services.UserDetailsImpl;
import com.rbp.movieapp.security.services.UserDetailsServiceImpl;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.bson.types.ObjectId;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1.0/moviebooking")
@OpenAPIDefinition(
        info = @Info(
                title = "Movie Application API",
                description = "This API provides endpoints for managing movies."
        )
)
@Slf4j
public class MovieController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private MovieService movieService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private MovieRepository movieRepository;


    @Autowired
    JwtUtils jwtUtils;

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/{loginId}/forgot")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "reset password")
 //   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> changePassword(@RequestBody LoginRequest loginRequest, @PathVariable String loginId){
        log.debug("forgot password endopoint accessed by "+loginRequest.getLoginId());
        Optional<User> user1 = userRepository.findByLoginId(loginId);
            User availableUser = user1.get();
            User updatedUser = new User(
                            loginId,
                    availableUser.getFirstName(),
                    availableUser.getLastName(),
                    availableUser.getEmail(),
                    availableUser.getContactNumber(),
                    passwordEncoder.encode(loginRequest.getPassword())
                    );
            updatedUser.set_id(availableUser.get_id());
            updatedUser.setRoles(availableUser.getRoles());
            userRepository.save(updatedUser);
            log.debug(loginRequest.getLoginId()+" has password changed successfully");
            return new ResponseEntity<>("Users password changed successfully",HttpStatus.OK);
    }

    @GetMapping("/all")
    @CrossOrigin(origins = "http://localhost:3000")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "search all movies")
    @PreAuthorize("hasRole('USER')or hasRole('ADMIN')")
    public ResponseEntity<List<Movie>> getAllMovies( ) {

       // token = token.substring(1, token.length() - 1);

//         boolean b = jwtUtils.validateJwtToken(token);
        List<Movie> movieList = movieService.getAllMovies();
//          if(b) {

        if (movieList.isEmpty()) {
            log.debug("currently no movies are available");
            throw new MoviesNotFound("No Movies are available");
        } else {
            log.debug("listed the available movies");
            System.out.println(movieList);
            return new ResponseEntity<>(movieList, HttpStatus.FOUND);
        }

//        }else{
//            log.debug("Error in token");
//            throw new MoviesNotFound("Error while getting movie");
//        }

    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/movies/search/{movieName}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "search movies by movie name")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Movie>> getMovieByName(@PathVariable String movieName){
        log.debug("here search a movie by its name");
        List<Movie> movieList = movieService.getMovieByName(movieName);
        if(movieList.isEmpty()){
            log.debug("currently no movies are available");
            throw new MoviesNotFound("Movies Not Found");
        }
        else
            log.debug("listed the available movies with title:"+movieName);
            return new ResponseEntity<>(movieList,HttpStatus.OK);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/{movieName}/add")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "book ticket")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> bookTickets(  @RequestBody Ticket ticket, @PathVariable String movieName ) {
        log.debug(ticket.getLoginId()+" entered to book tickets");
        log.debug(ticket+" tickets passed");
        List<Movie> m=movieRepository.findByMovieName(movieName);

     //   String [] strSplit=ticket.getSeatNumber().split(",");

//        ArrayList<String> strList = new ArrayList<String>(
//                Arrays.asList(strSplit));

        List<Ticket> allTickets = movieService.findSeats(movieName,ticket.getTheatreName());
        for(Ticket each : allTickets){
            for(int i = 0; i < ticket.getNoOfTickets(); i++){
                if(ticket.getMovieName().equals(each.getMovieName()) && each.getSeatNumber().contains(ticket.getSeatNumber())){
                    log.debug("seat is already booked");
                    throw new SeatAlreadyBooked("Seat number "+ticket.getSeatNumber()+" is already booked");
                }
            }
        }

        if(movieService.findAvailableTickets(movieName,ticket.getTheatreName()).get(0).getNoOfTicketsAvailable() >=
                ticket.getNoOfTickets()){

            log.info("available tickets "
                    +movieService.findAvailableTickets(movieName,ticket.getTheatreName()).get(0).getNoOfTicketsAvailable());
            movieService.saveTicket(ticket);
            log.debug(ticket.getLoginId()+" booked "+ticket.getNoOfTickets()+" tickets");

            for(Movie movie:m) {
                ticket.setTicketStatus(movie.getTicketsStatus());
                rabbitTemplate.convertAndSend(MessageConfig.rabbitMqExcahnge, MessageConfig.rabbitMqRoutingKey, ticket );
            }
      //    updateAvailableTickectsInMovie(movieName,ticket.getTheatreName(),ticket.getNoOfTickets());
            return new ResponseEntity<>("Tickets Booked Successfully with seat numbers"+ticket.getSeatNumber(),HttpStatus.OK);
        }
        else{
            log.debug("tickets sold out");
            return new ResponseEntity<>("\"All tickets sold out\"",HttpStatus.OK);
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getallbookedtickets/{movieName}")
   @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "get all booked tickets(Admin Only)")
   // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ticket>> getAllBookedTickets(@PathVariable String movieName){
        return new ResponseEntity<>(movieService.getAllBookedTickets(movieName),HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/{movieName}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateTicketStatus(@PathVariable String movieName) {
        List<Movie> movie = movieRepository.findByMovieName(movieName);
        List<Ticket> ticket = ticketRepository.findByMovieName(movieName);
        log.debug("Inside update Status");
        if (movie == null) {
            throw new MoviesNotFound("Movie not found: " + movieName);
        }

        if (ticket == null) {
            throw new NoSuchElementException("Ticket Not found:" );
        }
        //int ticketsBooked = movieService.getTotalNoTickets(movieName);
        for (Movie movies : movie) {
            if (movies.getNoOfTicketsAvailable() == 0) {
                movies.setTicketsStatus("SOLD OUT");
            } else {
                movies.setTicketsStatus("BOOK ASAP");
            }
            movieService.saveMovie(movies);
        }
        return new ResponseEntity<>("Ticket status updated successfully", HttpStatus.OK);

    }


    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/{movieName}/delete")@SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "delete a movie(Admin Only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteMovie(@PathVariable String movieName){
        List<Movie> availableMovies = movieService.findByMovieName(movieName);
        if(availableMovies.isEmpty()){
            throw new MoviesNotFound("No movies Available with moviename "+ movieName);
        }
        else {
            movieService.deleteByMovieName(movieName);

            return new ResponseEntity<>("Movie deleted successfully",HttpStatus.OK);
        }

    }



}
