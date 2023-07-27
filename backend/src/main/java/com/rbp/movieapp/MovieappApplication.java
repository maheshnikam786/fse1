package com.rbp.movieapp;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rbp.movieapp.models.ERole;
import com.rbp.movieapp.models.Movie;
import com.rbp.movieapp.models.Role;
import com.rbp.movieapp.models.User;
import com.rbp.movieapp.repository.MovieRepository;
import com.rbp.movieapp.repository.RoleRepository;
import com.rbp.movieapp.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class MovieappApplication implements CommandLineRunner {

	@Autowired
	private MovieRepository movieRepository;
	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	private MongoTemplate mongoTemplate;


	public static void main(String[] args) {
		SpringApplication.run(MovieappApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		mongoTemplate.dropCollection("roles");
		mongoTemplate.dropCollection("ticket");
		mongoTemplate.dropCollection("users");
		mongoTemplate.dropCollection("movie");
		ObjectMapper mapper = new ObjectMapper();
		mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
		Movie movie1 = new Movie("KGF2","Korum Mall",126,"Book ASAP");
	//	Movie movie12 = new Movie("KGF2","LULU Mall",120,"Book ASAP");
	 	Movie movie2 = new Movie("Dabaang2","Viviana",122,"Book ASAP");
	 	Movie movie3 = new Movie("Tanaji","Anand",50,"Book ASAP");
		Movie movie4 = new Movie("Gaabar","Cinepolis",99);
		Movie movie5 = new Movie("Student Of The Year","Metro Mall",100);
		Movie movie6 = new Movie("Zoravar","Wonder Mall",107);

	 	movieRepository.saveAll(List.of(movie1,movie2,movie3,movie4,movie5,movie6));


		Role admin = new Role(ERole.ROLE_ADMIN);
		Role user = new Role(ERole.ROLE_USER);
		admin.set_id(ObjectId.get().toString());
		User adminRegister=new User();
		List<Role> a=new ArrayList<>();
		a.add(admin);
		ObjectId adminId = ObjectId.get();

		adminRegister.set_id(adminId);
		adminRegister.setLoginId("admin");
		adminRegister.setEmail("admin@gmail.com");
		adminRegister.setContactNumber(11111111L);
		adminRegister.setRoles(a);
		adminRegister.setFirstName("admin");
		adminRegister.setLastName("admin");

		adminRegister.setPassword(encoder.encode("admin"));
		userRepository.save(adminRegister);
		roleRepository.saveAll(List.of(admin,user));
		
		
	}
}
