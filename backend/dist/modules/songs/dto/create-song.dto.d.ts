import { BaseSongDto } from "./base-song.dto";
export declare class CreateSongDto extends BaseSongDto {
    audioUrl: string;
    pdfUrl: string;
    uploadedBy: string;
    suggestedBy?: string;
}
export declare class SuggestSongDto {
    title?: string;
    artist?: string;
    category?: string;
    suggestedBy: string;
    songId?: string;
}
