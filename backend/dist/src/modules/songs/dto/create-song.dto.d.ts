export declare class CreateSongDto {
    title: string;
    artist: string;
    uploadedBy: string;
    category: string;
    audioUrl: string;
    sheetMusicUrl: string;
}
export declare class SuggestSongDto {
    title?: string;
    artist?: string;
    suggestedBy: string;
    songId?: string;
}
