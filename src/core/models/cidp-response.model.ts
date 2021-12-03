export interface CidpResponseModel {
    receiptIds: CidpReceiptModel[]
}

export interface CidpReceiptModel {
    itemId: any,
    receiptId: string,
    status: string,
    statusMessage: string,
}