export const tagMap: { [key: string]: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } } = {
  OS: { label: 'Open Source', variant: 'secondary' },
  SH: { label: 'Self-Hosted', variant: 'secondary' },
  CC: { label: 'No-Card Required', variant: 'outline' },
  FF: { label: 'Free Forever', variant: 'default' },
  β: { label: 'Beta', variant: 'destructive' },
  '*': { label: 'Popular', variant: 'default' },
  NC: { label: 'No Card', variant: 'outline' },
};
