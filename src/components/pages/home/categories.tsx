import CategoryCard from './category-card';
import { categories } from '@/data/categories';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Categories() {
  return (
    <motion.section 
      id="solutions" 
      className="py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="text-center">
        <motion.h2 
          className="text-3xl font-bold tracking-tight font-headline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Building Your Dream
        </motion.h2>
        <motion.p 
          className="mt-2 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Pick a Solution to get started on your journey.
        </motion.p>
      </div>
      <div className="mt-12">
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
           {categories.map((category) => (
              <div key={category.slug} className="flex-shrink-0 w-4/5 sm:w-2/3">
                  <CategoryCard {...category} />
              </div>
          ))}
          <div className="flex-shrink-0 w-1"></div>
        </div>
        {/* Desktop: Grid */}
        <motion.div 
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
          variants={containerVariants}
        >
          {categories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
