"""empty message

Revision ID: 3c7c5fae2e15
Revises: 
Create Date: 2023-08-24 16:26:05.422173

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c7c5fae2e15'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('actor',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('known_for_department', sa.String(length=80), nullable=True),
    sa.Column('character', sa.String(length=200), nullable=True),
    sa.Column('profile_path', sa.String(length=200), nullable=True),
    sa.Column('biography', sa.Text(), nullable=True),
    sa.Column('birthday', sa.Date(), nullable=True),
    sa.Column('deathday', sa.Date(), nullable=True),
    sa.Column('place_of_birth', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('director',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('known_for_department', sa.String(length=80), nullable=True),
    sa.Column('profile_path', sa.String(length=200), nullable=True),
    sa.Column('biography', sa.Text(), nullable=True),
    sa.Column('birthday', sa.Date(), nullable=True),
    sa.Column('deathday', sa.Date(), nullable=True),
    sa.Column('place_of_birth', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('genre',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('movie',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=180), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('ranking', sa.Float(), nullable=True),
    sa.Column('image', sa.String(length=180), nullable=True),
    sa.Column('trailer_key', sa.String(length=180), nullable=True),
    sa.Column('trailer_type', sa.String(length=50), nullable=True),
    sa.Column('trailer_id', sa.String(length=180), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=True),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=150), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('secret_question', sa.String(length=100), nullable=False),
    sa.Column('secret_answer', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('favorite',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('actor_id', sa.Integer(), nullable=True),
    sa.Column('director_id', sa.Integer(), nullable=True),
    sa.Column('movie_id', sa.Integer(), nullable=True),
    sa.Column('favorite_type', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['actor_id'], ['actor.id'], ),
    sa.ForeignKeyConstraint(['director_id'], ['director.id'], ),
    sa.ForeignKeyConstraint(['movie_id'], ['movie.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('movie_actor',
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.Column('actor_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['actor_id'], ['actor.id'], ),
    sa.ForeignKeyConstraint(['movie_id'], ['movie.id'], ),
    sa.PrimaryKeyConstraint('movie_id', 'actor_id')
    )
    op.create_table('movie_director',
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.Column('director_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['director_id'], ['director.id'], ),
    sa.ForeignKeyConstraint(['movie_id'], ['movie.id'], ),
    sa.PrimaryKeyConstraint('movie_id', 'director_id')
    )
    op.create_table('movie_genres',
    sa.Column('movie_id', sa.Integer(), nullable=True),
    sa.Column('genre_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['genre_id'], ['genre.id'], ),
    sa.ForeignKeyConstraint(['movie_id'], ['movie.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('movie_genres')
    op.drop_table('movie_director')
    op.drop_table('movie_actor')
    op.drop_table('favorite')
    op.drop_table('user')
    op.drop_table('movie')
    op.drop_table('genre')
    op.drop_table('director')
    op.drop_table('actor')
    # ### end Alembic commands ###
