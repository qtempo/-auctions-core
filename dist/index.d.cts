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

type Result<E extends Error, T> = Either<E, T>;

declare abstract class UploadAuctionPictureRepository implements UploadAuctionPictureServicePort {
    protected abstract persistPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>;
    upload(id: AuctionID, pictureBase64: string): Promise<Result<UploadAuctionPictureError, string>>;
}

declare class MockUploadAuctionPictureRepository extends UploadAuctionPictureRepository {
    protected persistPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>;
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

type index_AuctionNotFoundError = AuctionNotFoundError;
declare const index_AuctionNotFoundError: typeof AuctionNotFoundError;
type index_AuctionPlaceBidError = AuctionPlaceBidError;
declare const index_AuctionPlaceBidError: typeof AuctionPlaceBidError;
type index_AuctionPlaceBidPort = AuctionPlaceBidPort;
type index_AuctionPlaceBidRequest = AuctionPlaceBidRequest;
type index_CreateAuctionError = CreateAuctionError;
declare const index_CreateAuctionError: typeof CreateAuctionError;
type index_CreateAuctionPort = CreateAuctionPort;
type index_CreateAuctionRequest = CreateAuctionRequest;
type index_CreateAuctionUseCase = CreateAuctionUseCase;
declare const index_CreateAuctionUseCase: typeof CreateAuctionUseCase;
type index_GetAuctionPort = GetAuctionPort;
type index_GetAuctionUseCase = GetAuctionUseCase;
declare const index_GetAuctionUseCase: typeof GetAuctionUseCase;
type index_GetAuctionsByStatusPort = GetAuctionsByStatusPort;
type index_GetAuctionsByStatusUseCase = GetAuctionsByStatusUseCase;
declare const index_GetAuctionsByStatusUseCase: typeof GetAuctionsByStatusUseCase;
type index_MockUploadAuctionPictureRepository = MockUploadAuctionPictureRepository;
declare const index_MockUploadAuctionPictureRepository: typeof MockUploadAuctionPictureRepository;
type index_PlaceBidUseCase = PlaceBidUseCase;
declare const index_PlaceBidUseCase: typeof PlaceBidUseCase;
type index_SetAuctionPictureUrlPort = SetAuctionPictureUrlPort;
type index_UploadAuctionPictureError = UploadAuctionPictureError;
declare const index_UploadAuctionPictureError: typeof UploadAuctionPictureError;
type index_UploadAuctionPictureRepository = UploadAuctionPictureRepository;
declare const index_UploadAuctionPictureRepository: typeof UploadAuctionPictureRepository;
type index_UploadAuctionPictureRequest = UploadAuctionPictureRequest;
type index_UploadAuctionPictureServicePort = UploadAuctionPictureServicePort;
type index_UploadAuctionPictureUseCase = UploadAuctionPictureUseCase;
declare const index_UploadAuctionPictureUseCase: typeof UploadAuctionPictureUseCase;
declare namespace index {
  export { index_AuctionNotFoundError as AuctionNotFoundError, index_AuctionPlaceBidError as AuctionPlaceBidError, type index_AuctionPlaceBidPort as AuctionPlaceBidPort, type index_AuctionPlaceBidRequest as AuctionPlaceBidRequest, index_CreateAuctionError as CreateAuctionError, type index_CreateAuctionPort as CreateAuctionPort, type index_CreateAuctionRequest as CreateAuctionRequest, index_CreateAuctionUseCase as CreateAuctionUseCase, type index_GetAuctionPort as GetAuctionPort, index_GetAuctionUseCase as GetAuctionUseCase, type index_GetAuctionsByStatusPort as GetAuctionsByStatusPort, index_GetAuctionsByStatusUseCase as GetAuctionsByStatusUseCase, index_MockUploadAuctionPictureRepository as MockUploadAuctionPictureRepository, index_PlaceBidUseCase as PlaceBidUseCase, type index_SetAuctionPictureUrlPort as SetAuctionPictureUrlPort, index_UploadAuctionPictureError as UploadAuctionPictureError, index_UploadAuctionPictureRepository as UploadAuctionPictureRepository, type index_UploadAuctionPictureRequest as UploadAuctionPictureRequest, type index_UploadAuctionPictureServicePort as UploadAuctionPictureServicePort, index_UploadAuctionPictureUseCase as UploadAuctionPictureUseCase };
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

export { type Auction, type AuctionBidderEmail, type AuctionID, AuctionRepository, type AuctionSellerEmail, index as UserModule, auctionStatuses };
