import { LanguageCode } from "../../models";
import { Madara } from "../Madara";

export class TestClass extends Madara {
    baseUrl: string = "https://www.webtoon.xyz"
    languageCode: LanguageCode = LanguageCode.ENGLISH

}