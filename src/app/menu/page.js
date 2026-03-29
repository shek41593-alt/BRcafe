import prisma from '../../lib/prisma';

export const dynamic = 'force-dynamic';
import MenuItem from '../components/MenuItem';
import FloatingCartButton from '../components/FloatingCartButton';
import MenuClient from './MenuClient';

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    include: { items: true },
    orderBy: { name: 'asc' }
  });

  const allItems = categories.flatMap(cat => 
    cat.items.map(item => ({
      ...item,
      category: cat.name
    }))
  );

  const categoryNames = categories.map(cat => cat.name);

  return (
    <div style={{ padding: 'var(--space-6) 0' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Our Menu</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>Treat yourself to a diverse menu ranging from authentic South Indian dosas to sweet milkshakes and creamy ice creams.</p>
        
        <MenuClient categories={categoryNames} initialItems={allItems} />
      </div>
      <FloatingCartButton />
    </div>
  );
}
