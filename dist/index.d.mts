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

declare class CreateAuctionError extends Error {
    name: "CreateAuctionError";
    constructor(message: string);
    static titleValidationFail(): CreateAuctionError;
    static sellerValidationFail(): CreateAuctionError;
}

type Result<E extends Error, T> = Either<E, T>;

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

declare class AuctionUploadPictureError extends Error {
    name: "AuctionUploadPictureError";
}

interface SetAuctionPictureUrlPort extends GetAuctionPort {
    setPictureUrl(id: AuctionID, pictureUrl: string): Promise<Result<Error, Auction>> | Result<Error, Auction>;
}

interface UploadPictureServicePort {
    uploadPicture(id: AuctionID, pictureBase64: string): Promise<Result<Error, string>> | Result<Error, string>;
}

type UploadAuctionPictureRequest = Pick<Auction, 'id' | 'seller'> & {
    pictureBase64: string;
};

declare class UploadAuctionPictureUseCase implements UseCase<UploadAuctionPictureRequest, Auction> {
    private readonly auctionPort;
    private readonly uploadPictureService;
    constructor(auctionPort: SetAuctionPictureUrlPort, uploadPictureService: UploadPictureServicePort);
    execute({ id, seller, pictureBase64 }: UploadAuctionPictureRequest): Promise<Result<Error, Auction>>;
}

declare class AuctionsError extends Error {
    name: "AuctionsError";
}

declare abstract class AuctionRepository implements CreateAuctionPort, GetAuctionPort, GetAuctionsByStatusPort, AuctionPlaceBidPort, SetAuctionPictureUrlPort {
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

declare abstract class FileUploadRepository implements UploadPictureServicePort {
    protected abstract persistPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>;
    uploadPicture(id: AuctionID, pictureBase64: string): Promise<Result<AuctionUploadPictureError, string>>;
}

export { type Auction, type AuctionBidderEmail, type AuctionID, AuctionNotFoundError, AuctionPlaceBidError, type AuctionPlaceBidPort, type AuctionPlaceBidRequest, AuctionRepository, type AuctionSellerEmail, AuctionUploadPictureError, CreateAuctionError, type CreateAuctionPort, type CreateAuctionRequest, CreateAuctionUseCase, FileUploadRepository, type GetAuctionPort, GetAuctionUseCase, type GetAuctionsByStatusPort, GetAuctionsByStatusUseCase, PlaceBidUseCase, type SetAuctionPictureUrlPort, type UploadAuctionPictureRequest, UploadAuctionPictureUseCase, type UploadPictureServicePort, auctionStatuses };
