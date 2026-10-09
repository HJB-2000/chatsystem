import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const ID = /^\d{1,19}$/;

export class ChannelDto {
  @Matches(ID) channelId: string;
}

export class SendMessageDto {
  @Matches(ID) channelId: string;

  @IsString() @IsNotEmpty() @MaxLength(2000)
  content: string;
}

export class TypingDto {
  @Matches(ID) channelId: string;
  @IsBoolean() isTyping: boolean;
}

export class HistoryDto {
  @Matches(ID) channelId: string;

  @IsOptional() @Matches(ID)
  before?: string; // messageId cursor

  @IsOptional() @IsInt() @Min(1) @Max(100)
  limit?: number;
}