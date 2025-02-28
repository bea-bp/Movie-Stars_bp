from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
# from sqlalchemy.ext.hybrid import hybrid_property

db = SQLAlchemy()

# Tabla de relación entre Movie y Actor
movie_actor = db.Table('movie_actor',
                       db.Column('movie_id', db.Integer, db.ForeignKey(
                           'movie.id'), primary_key=True),
                       db.Column('actor_id', db.Integer, db.ForeignKey(
                           'actor.id'), primary_key=True)
                       )

# Tabla de relación entre Movie y Director
movie_director = db.Table('movie_director',
                          db.Column('movie_id', db.Integer, db.ForeignKey(
                              'movie.id'), primary_key=True),
                          db.Column('director_id', db.Integer, db.ForeignKey(
                              'director.id'), primary_key=True)
                          )

# Tabla de relación entre Movie y Genres
movie_genres_association = db.Table('movie_genres',
                                    db.Column('movie_id', db.Integer,
                                              db.ForeignKey('movie.id')),
                                    db.Column('genre_id', db.Integer,
                                              db.ForeignKey('genre.id'))
                                    )

# GENERE CLASS


class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    def __repr__(self):
        return f'<Genre {self.id} {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }

# USER CLASS


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(150), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    secret_question = db.Column(db.String(100), unique=False, nullable=False)
    secret_answer = db.Column(db.String(100), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, security breach
        }

# MOVIE CLASS


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(180))
    description = db.Column(db.Text)
    ranking = db.Column(db.Float)  # Puede representar números con decimales
    image = db.Column(db.String(180))
    trailer_key = db.Column(db.String(180))
    trailer_type = db.Column(db.String(50))
    trailer_id = db.Column(db.String(180))
    actors = db.relationship('Actor', secondary='movie_actor')
    directors = db.relationship('Director', secondary='movie_director')
    genres = db.relationship(
        'Genre', secondary=movie_genres_association, backref='movie')

    def __repr__(self):
        return f'<Movie {self.id} {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "ranking": self.ranking,
            "actors": [actor.serialize() for actor in self.actors],
            "directors": [director.serialize() for director in self.directors],
            "image": self.image,
            "trailer_key": self.trailer_key,
            "trailer_type": self.trailer_type,
            "trailer_id": self.trailer_id,
            "genres": [genre.serialize() for genre in self.genres],
        }


# ACTOR CLASS
class Actor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    known_for_department = db.Column(db.String(80))
    character = db.Column(db.String(200))
    profile_path = db.Column(db.String(200))
    biography = db.Column(db.Text)
    birthday = db.Column(db.Date)
    deathday = db.Column(db.Date, nullable=True)
    place_of_birth = db.Column(db.String(200))

    def __repr__(self):
        return f'<Actor {self.id} {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "known_for_department": self.known_for_department,
            "character": self.character,
            "profile_path": self.profile_path,
            "biography": self.biography,
            "birthday": self.birthday,
            "deathday":  self.deathday,
            "place_of_birth": self.place_of_birth,
        }

# DIRECTOR CLASS


class Director(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    known_for_department = db.Column(db.String(80))
    profile_path = db.Column(db.String(200))
    biography = db.Column(db.Text)
    birthday = db.Column(db.Date)
    deathday = db.Column(db.Date, nullable=True)
    place_of_birth = db.Column(db.String(200))

    def __repr__(self):
        return f'<Director {self.id} {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "known_for_department": self.known_for_department,
            "profile_path": self.profile_path,
            "biography": self.biography,
            "birthday": self.birthday,
            "deathday":  self.deathday,
            "place_of_birth": self.place_of_birth,
        }


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    actor_id = db.Column(db.Integer, db.ForeignKey('actor.id'), nullable=True)
    director_id = db.Column(
        db.Integer, db.ForeignKey('director.id'), nullable=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=True)
    user = db.relationship("User", backref="favorites")
    actor = db.relationship("Actor", backref="favorites")
    director = db.relationship("Director", backref="favorites")
    movie = db.relationship("Movie", backref="favorites")
    favorite_type = db.Column(db.String(50))

    def __repr__(self):
        return f'Favorite {self.id}'

    def serialize(self):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "favorite_type": self.favorite_type
        }

        if self.favorite_type == "actor" and self.actor_id:
            data["name"] = self.actor.name
        elif self.favorite_type == "director" and self.director_id:
            data["name"] = self.director.name
        elif self.favorite_type == "movie" and self.movie_id:
            data["name"] = self.movie.name

        return data
