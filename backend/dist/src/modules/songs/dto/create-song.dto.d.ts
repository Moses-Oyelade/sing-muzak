export declare class CreateSongDto {
    title: string;
    artist: string;
    category: string;
    audioUrl: string;
    sheetMusicUrl: string;
    uploadedBy: string;
    suggestedBy?: string;
}
export declare class SuggestSongDto {
    title?: string;
    artist?: string;
    category: string;
    suggestedBy: string;
    songId?: string;
}
