import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/https-adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){

  }
  
  async executeSeed(){
    await this.pokemonModel.deleteMany({}); // delete * form pokemons

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const pokemonsToInsert: { name: string, no: number}[] = [];

    data.results.forEach( async ({ name, url }) => {
      //console.log({ name, url });
      const segments = url.split('/');
      const no: number = +segments[ segments.length - 2];

      //const pokemon = await this.pokemonModel.create( { name, no });
      pokemonsToInsert.push( { name, no } ); //[{ name: bulbasaur, no: 1 }]
      

      await this.pokemonModel.insertMany( pokemonsToInsert );
    })
    return 'Seed Executed';
  }
}
