import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'creatoros:public';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);