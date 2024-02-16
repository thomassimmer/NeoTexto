export interface TextInterface {
  id: string;
  text: string;
  lemmas: string;
  language: LanguageInterface;
  subject: string;
  hasFinishedGeneration: boolean;
}

export interface WordInterface {
  language: LanguageInterface;
  word: string;
}

export interface ExampleInterface {
  sourcePrefix: string;
  sourceTerm: string;
  sourceSuffix: string;
  targetPrefix: string;
  targetTerm: string;
  targetSuffix: string;
}

export interface TranslationInterface {
  id: number;
  wordSource: WordInterface;
  wordTarget: WordInterface;
  examples?: ExampleInterface[];
  provider: string;
}

export interface UserTranslationInterface {
  id?: number;
  translation: TranslationInterface;
}

export interface DefinitionInterface {
  word: WordInterface;
  translations: TranslationInterface[];
}

export interface ErrorFormSignUpInterface {
  email?: string[];
  password1?: string[];
  password2?: string[];
  nonFieldErrors?: string[];
}

export interface ErrorFormPasswordResetInterface {
  uid?: string[];
  newPassword1?: string[];
  newPassword2?: string[];
  token?: string[];
}

export interface ErrorFormSignInInterface {
  email?: string[];
  password?: string[];
  nonFieldErrors?: string[];
}

export interface ErrorFormUpdateProfileInterface {
  email: string[];
  userId: string[];
  username: string[];
  password: string[];
  hasFinishedIntro: string[];
  image: string[];
}

export interface CustomUser {
  userId: string;
  email: string;
  hasFinishedIntro: boolean;
  image: string;
  motherTongue: LanguageInterface;
  credit: number;
}

export interface LanguageInterface {
  name: string;
  code: string;
  id: number;
}

export enum TranslationProvider {
  Microsoft = "Microsoft",
  Yandex = "Yandex",
  ChatGPT = "ChatGPT",
}
