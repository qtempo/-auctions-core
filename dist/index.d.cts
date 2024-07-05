import { UUID } from 'node:crypto';
import { Either } from '@sweet-monads/either';

declare const auctionStatuses: readonly ["OPEN", "CLOSED"];
type AuctionID = UUID;
type AuctionSellerEmail = string;
type AuctionBidderEmail = string;
interface Auction {
    id: AuctionID;
    title: string;
    status: (typeof auctionStatuses)[number];
    createdAt: string;
    endingAt: string;
    seller: AuctionSellerEmail;
    pictureUrl: string;
    highestBid: {
        amount: number;
        bidder: AuctionBidderEmail;
    };
}

declare class AuctionsError extends Error {
    name: "AuctionsError";
}

type Result<E extends Error, T> = Either<E, T>;

interface DomainEvent {
}

declare class AuctionsNotification implements DomainEvent {
    private readonly recipient;
    private readonly subject;
    private readonly body;
    constructor(recipient: AuctionSellerEmail | AuctionBidderEmail, subject: string, body: string);
    get(): {
        recipient: string;
        subject: string;
        body: string;
    };
}

declare class CreateAuctionError extends Error {
    name: "CreateAuctionError";
    constructor(message: string);
    static titleValidationFail(): CreateAuctionError;
    static sellerValidationFail(): CreateAuctionError;
}

type CreateAuctionRequest = Pick<Auction, 'title' | 'seller'>;

interface CreateAuctionPort {
    create(request: CreateAuctionRequest): Promise<Result<Error, Auction>> | Result<Error, Auction>;
}

interface UseCase<TRequest, TResponse> {
    execute(request?: TRequest): Promise<Result<Error, TResponse>> | Result<Error, TResponse>;
}

declare class CreateAuctionUseCase implements UseCase<CreateAuctionRequest, Auction> {
    private readonly createAuctionPort;
    constructor(createAuctionPort: CreateAuctionPort);
    execute(request: CreateAuctionRequest): Promise<Result<Error, Auction>>;
}

declare class AuctionNotFoundError extends Error {
    name: "AuctionNotFoundError";
    constructor(id: AuctionID);
}

interface Query<E extends Error, TRequest, TResponse> {
    get(request?: TRequest): Promise<Result<E, TResponse>> | Result<E, TResponse>;
}

interface GetAuctionPort extends Query<Error, AuctionID, Auction> {
}

declare class GetAuctionUseCase implements UseCase<AuctionID, Auction> {
    private readonly getAuctionPort;
    constructor(getAuctionPort: GetAuctionPort);
    execute(id: AuctionID): Promise<Result<Error, Auction>>;
}

interface GetAuctionsByStatusPort {
    byStatus(status: Auction['status']): Promise<Result<Error, Auction[]>> | Result<Error, Auction[]>;
}

declare class GetAuctionsByStatusUseCase implements UseCase<Auction['status'], Auction[]> {
    private readonly getByStatusPort;
    constructor(getByStatusPort: GetAuctionsByStatusPort);
    execute(status: Auction['status']): Promise<Result<Error, Auction[]>>;
}

declare class AuctionPlaceBidError extends Error {
    name: "AuctionPlaceBidError";
}

type AuctionPlaceBidRequest = Auction['highestBid'] & {
    id: AuctionID;
};

interface AuctionPlaceBidPort extends GetAuctionPort {
    placeBid(placeBid: AuctionPlaceBidRequest): Promise<Result<Error, Auction>> | Result<Error, Auction>;
}

declare class PlaceBidUseCase implements UseCase<AuctionPlaceBidRequest, Auction> {
    private readonly placeBidPort;
    constructor(placeBidPort: AuctionPlaceBidPort);
    execute(request: AuctionPlaceBidRequest): Promise<Result<Error, Auction>>;
}

declare class UploadAuctionPictureError extends Error {
    name: "UploadAuctionPictureError";
}

interface SetAuctionPictureUrlPort extends GetAuctionPort {
    setPictureUrl(id: AuctionID, pictureUrl: string): Promise<Result<Error, Auction>> | Result<Error, Auction>;
}

interface UploadAuctionPictureServicePort {
    upload(id: AuctionID, pictureBase64: string): Promise<Result<Error, string>> | Result<Error, string>;
}

type UploadAuctionPictureRequest = Pick<Auction, 'id' | 'seller'> & {
    pictureBase64: string;
};

declare class UploadAuctionPictureUseCase implements UseCase<UploadAuctionPictureRequest, Auction> {
    private readonly auctionPort;
    private readonly uploadPictureService;
    constructor(auctionPort: SetAuctionPictureUrlPort, uploadPictureService: UploadAuctionPictureServicePort);
    execute({ id, seller, pictureBase64 }: UploadAuctionPictureRequest): Promise<Result<Error, Auction>>;
}

type index$2_AuctionNotFoundError = AuctionNotFoundError;
declare const index$2_AuctionNotFoundError: typeof AuctionNotFoundError;
type index$2_AuctionPlaceBidError = AuctionPlaceBidError;
declare const index$2_AuctionPlaceBidError: typeof AuctionPlaceBidError;
type index$2_AuctionPlaceBidPort = AuctionPlaceBidPort;
type index$2_AuctionPlaceBidRequest = AuctionPlaceBidRequest;
type index$2_CreateAuctionError = CreateAuctionError;
declare const index$2_CreateAuctionError: typeof CreateAuctionError;
type index$2_CreateAuctionPort = CreateAuctionPort;
type index$2_CreateAuctionRequest = CreateAuctionRequest;
type index$2_CreateAuctionUseCase = CreateAuctionUseCase;
declare const index$2_CreateAuctionUseCase: typeof CreateAuctionUseCase;
type index$2_GetAuctionPort = GetAuctionPort;
type index$2_GetAuctionUseCase = GetAuctionUseCase;
declare const index$2_GetAuctionUseCase: typeof GetAuctionUseCase;
type index$2_GetAuctionsByStatusPort = GetAuctionsByStatusPort;
type index$2_GetAuctionsByStatusUseCase = GetAuctionsByStatusUseCase;
declare const index$2_GetAuctionsByStatusUseCase: typeof GetAuctionsByStatusUseCase;
type index$2_PlaceBidUseCase = PlaceBidUseCase;
declare const index$2_PlaceBidUseCase: typeof PlaceBidUseCase;
type index$2_SetAuctionPictureUrlPort = SetAuctionPictureUrlPort;
type index$2_UploadAuctionPictureError = UploadAuctionPictureError;
declare const index$2_UploadAuctionPictureError: typeof UploadAuctionPictureError;
type index$2_UploadAuctionPictureRequest = UploadAuctionPictureRequest;
type index$2_UploadAuctionPictureServicePort = UploadAuctionPictureServicePort;
type index$2_UploadAuctionPictureUseCase = UploadAuctionPictureUseCase;
declare const index$2_UploadAuctionPictureUseCase: typeof UploadAuctionPictureUseCase;
declare namespace index$2 {
  export { index$2_AuctionNotFoundError as AuctionNotFoundError, index$2_AuctionPlaceBidError as AuctionPlaceBidError, type index$2_AuctionPlaceBidPort as AuctionPlaceBidPort, type index$2_AuctionPlaceBidRequest as AuctionPlaceBidRequest, index$2_CreateAuctionError as CreateAuctionError, type index$2_CreateAuctionPort as CreateAuctionPort, type index$2_CreateAuctionRequest as CreateAuctionRequest, index$2_CreateAuctionUseCase as CreateAuctionUseCase, type index$2_GetAuctionPort as GetAuctionPort, index$2_GetAuctionUseCase as GetAuctionUseCase, type index$2_GetAuctionsByStatusPort as GetAuctionsByStatusPort, index$2_GetAuctionsByStatusUseCase as GetAuctionsByStatusUseCase, index$2_PlaceBidUseCase as PlaceBidUseCase, type index$2_SetAuctionPictureUrlPort as SetAuctionPictureUrlPort, index$2_UploadAuctionPictureError as UploadAuctionPictureError, type index$2_UploadAuctionPictureRequest as UploadAuctionPictureRequest, type index$2_UploadAuctionPictureServicePort as UploadAuctionPictureServicePort, index$2_UploadAuctionPictureUseCase as UploadAuctionPictureUseCase };
}

interface ProcessAuctionsPort {
    getExpiredAuctions(): Promise<Auction[]>;
    closeAuction(auction: Auction): Promise<Result<Error, void>>;
}

declare class ProcessAuctionsUseCase implements UseCase<AuctionsError, number> {
    private readonly port;
    constructor(port: ProcessAuctionsPort);
    execute(): Promise<Result<Error, number>>;
}

type index$1_ProcessAuctionsPort = ProcessAuctionsPort;
type index$1_ProcessAuctionsUseCase = ProcessAuctionsUseCase;
declare const index$1_ProcessAuctionsUseCase: typeof ProcessAuctionsUseCase;
declare namespace index$1 {
  export { type index$1_ProcessAuctionsPort as ProcessAuctionsPort, index$1_ProcessAuctionsUseCase as ProcessAuctionsUseCase };
}

interface SendNotificationPort {
    send(notification: AuctionsNotification): Promise<Result<Error, void>> | Result<Error, void>;
}

declare class SendNotificationUseCase implements UseCase<AuctionsNotification, void> {
    private readonly notificationPort;
    constructor(notificationPort: SendNotificationPort);
    execute(request: AuctionsNotification): Promise<Result<Error, undefined>>;
}

type index_SendNotificationPort = SendNotificationPort;
type index_SendNotificationUseCase = SendNotificationUseCase;
declare const index_SendNotificationUseCase: typeof SendNotificationUseCase;
declare namespace index {
  export { type index_SendNotificationPort as SendNotificationPort, index_SendNotificationUseCase as SendNotificationUseCase };
}

declare abstract class UserAuctionsRepository implements CreateAuctionPort, GetAuctionPort, GetAuctionsByStatusPort, AuctionPlaceBidPort, SetAuctionPictureUrlPort {
    private _auction?;
    constructor(_auction?: Auction | undefined);
    protected abstract persist(auction: Auction): Promise<void>;
    protected abstract queryById(auctionId: AuctionID): Promise<Auction>;
    protected abstract queryByStatus(status: Auction['status']): Promise<Auction[]>;
    protected abstract persistBid(request: AuctionPlaceBidRequest): Promise<Auction>;
    protected abstract persistAuctionPictureUrl(id: AuctionID, pictureUrl: string): Promise<Auction>;
    private isIdValid;
    create({ title, seller }: CreateAuctionRequest): Promise<Result<CreateAuctionError, Auction>>;
    get(auctionID: AuctionID): Promise<Result<AuctionNotFoundError | AuctionsError, Auction>>;
    byStatus(status: Auction['status']): Promise<Result<Error, Auction[]>>;
    placeBid(request: AuctionPlaceBidRequest): Promise<Result<AuctionPlaceBidError | AuctionNotFoundError, Auction>>;
    setPictureUrl(id: AuctionID, pictureUrl: string): Promise<Result<Error, Auction>>;
}

declare abstract class UploadAuctionPictureRepository implements UploadAuctionPictureServicePort {
    protected abstract persistPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>;
    upload(id: AuctionID, pictureBase64: string): Promise<Result<UploadAuctionPictureError, string>>;
}

declare abstract class AutomaticProcessAuctionsRepository implements ProcessAuctionsPort {
    protected abstract persistClose(id: AuctionID): Promise<void>;
    abstract getExpiredAuctions(): Promise<Auction[]>;
    closeAuction(auction: Auction): Promise<Result<AuctionsError, void>>;
    private doEvent;
}

export { type Auction, type AuctionBidderEmail, type AuctionID, type AuctionSellerEmail, AuctionsNotification, AutomaticProcessAuctionsRepository, index$1 as AutomaticUseCases, index as NotificationUseCases, UploadAuctionPictureRepository, UserAuctionsRepository, index$2 as UserUseCases, auctionStatuses };
