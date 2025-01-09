import { ParsedStream } from '@aiostreams/types';
import { formatSize } from './utils';
import { serviceDetails } from '@aiostreams/utils';

export function torboxFormat(stream: ParsedStream): {
  name: string;
  description: string;
} {
  let name: string = '';

  name += `${stream.addon.name}`;
  if (stream.provider) {
    const serviceShortName = serviceDetails.find((service) => service.id === stream.provider!.id)?.shortName || stream.provider.id;
    name += ` (${serviceShortName}${stream.provider.cached === undefined ? ' Unknown' : stream.provider.cached ? ' Instant' : ''})`;
  }

  if (stream.torrent?.infoHash) {
    name += ` (P2P)`;
  }

  name += ` (${stream.resolution})`;

  let description: string = '';

  description += `Quality: ${stream.quality}\nName: ${stream.filename}\nSize: ${formatSize(stream.size || 0)}\nLanguage: ${stream.languages.length > 0 ? stream.languages.join(', ') : 'Unknown'}`;

  let streamType = stream.torrent
    ? 'Torrent'
    : stream.usenet
      ? 'Usenet'
      : stream.url
        ? 'Direct'
        : 'Unknown';
  description += `\nType: ${streamType}`;

  if (streamType === 'Torrent' || streamType === 'Usenet') {
    description += ` | ${streamType === 'Torrent' ? 'Seeders' : 'Age'}: ${streamType === 'Torrent' ? stream.torrent?.seeders : stream.usenet?.age}`;
  }

  return { name, description };
}
