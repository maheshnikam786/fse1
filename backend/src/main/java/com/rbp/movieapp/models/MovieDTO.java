package com.rbp.movieapp.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

@Data@NoArgsConstructor@AllArgsConstructor
public class MovieDTO {

    private ObjectId _id;
    private String movieName;

    private String theatreName;
    private Integer noOfTicketsAvailable;

    private String ticketsStatus;

}
