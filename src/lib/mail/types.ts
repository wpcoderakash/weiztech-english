/**
 * Shared mail types.
 *
 * The provider seam this file once described is gone: delivery is Microsoft
 * Graph, configured from the dashboard (lib/email/*). What remains is the
 * attachment shape, which the Graph client and the send pipeline both use.
 */
export interface MailAttachment {
  filename: string;
  contentType: string;
  content: Uint8Array;
}
