import { Module } from '@nestjs/common';
import { AxiosAdapter } from './https-adapters/axios.adapter';

@Module({
    providers: [ AxiosAdapter ],
    exports: [ AxiosAdapter ]
})
export class CommonModule {}
