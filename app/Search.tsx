import Hits from '@/components/Hits';
import { getResults } from '@/lib/search';

export default async function Search() {
  const hits = await getResults();
  return (
    <Hits hits={hits} />
  );
}
