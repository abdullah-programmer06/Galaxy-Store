import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminData, PackageVariant, defaultSettings, FeaturedGame, PaymentMethodConfig } from '../hooks/useAdminData';
import { Order } from '../types';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Folder,
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Save,
  X,
  Upload,
  Tv,
  ArrowUp,
  ArrowDown,
  Mail
} from 'lucide-react';

export function AdminDashboard() {
  const { 
    settings,
    updateSettings,
    products: mockProducts, 
    updateProductVariants, 
    addProduct, 
    updateProduct, 
    removeProduct,
    removeProductCategory,
    homeSections, 
    addHomeSection, 
    removeHomeSection, 
    updateHomeSection, 
    addProductToSection, 
    removeProductFromSection,
    orders,
    updateOrderStatus
  } = useAdminData();

  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  const [activeTab, setActiveTab] = useState<string>('home_sections');
  const [productCategoryFilter, setProductCategoryFilter] = useState<'All' | 'Top-Up' | 'Games' | 'Software' | 'Subscriptions'>('All');
  
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingVariants, setEditingVariants] = useState<PackageVariant[]>([]);
  const [editingProductDetails, setEditingProductDetails] = useState<any>(null);
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<{ title: string; category: string; basePrice: number; image: string; folder: string; description: string; images?: string[] }>({ title: '', category: 'Top-Up', basePrice: 0, image: '', folder: '', description: '' });
  
  const [isAddingSectionProduct, setIsAddingSectionProduct] = useState<string | null>(null);
  const [newSectionProduct, setNewSectionProduct] = useState({ title: '', type: 'Top-Up', price: 0, image: '' });
  const [newSectionName, setNewSectionName] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [managingSectionId, setManagingSectionId] = useState<string | null>(null);
  
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Admin' | 'Moderator'>('Moderator');

  // Featured games slider states
  const [editingSliderIndex, setEditingSliderIndex] = useState<number | null>(null);
  const [sliderForm, setSliderForm] = useState({
    title: '',
    tagline: '',
    description: '',
    price: 0,
    image: ''
  });
  const [isAddingSliderItem, setIsAddingSliderItem] = useState(false);

  // Payment methods edit states
  const [editingPaymentMethods, setEditingPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [isSavedPayment, setIsSavedPayment] = useState(false);

  // Contacts edit states
  const [editingContacts, setEditingContacts] = useState({ whatsapp: '', discord: '', email: '' });
  const [isSavedContacts, setIsSavedContacts] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (settings?.paymentMethods) {
      setEditingPaymentMethods(settings.paymentMethods);
    }
    if (settings?.contactInfo) {
      setEditingContacts({
        whatsapp: settings.contactInfo.whatsapp || '',
        discord: settings.contactInfo.discord || '',
        email: settings.contactInfo.email || ''
      });
    }
  }, [settings?.paymentMethods, settings?.contactInfo]);

  const staffMember = settings?.staff?.find(s => s.email?.toLowerCase() === currentUser?.email?.toLowerCase());
  const isSuperAdmin = currentUser?.email?.toLowerCase() === 'abubokkorbaqi@gmail.com';
  const role = isSuperAdmin ? 'Admin' : staffMember?.role;
  const isStaff = isSuperAdmin || !!staffMember;

  React.useEffect(() => {
    if (role === 'Moderator' && activeTab !== 'orders') {
      setActiveTab('orders');
    }
  }, [role, activeTab]);

  const filteredProducts = productCategoryFilter === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === productCategoryFilter);

  const toggleFolder = (folderName: string) => {
    setOpenFolders(prev => prev.includes(folderName) ? prev.filter(f => f !== folderName) : [...prev, folderName]);
  };

  const handleEditVariants = (productId: string) => {
    if (editingProductId === productId) {
      setEditingProductId(null);
    } else {
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        setEditingVariants([...product.variants]);
        setEditingProductId(productId);
        setEditingProductDetails({...product});
      }
    }
  };

  const handleUpdateVariant = (index: number, field: keyof PackageVariant, value: string | number) => {
    const newVariants = [...editingVariants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setEditingVariants(newVariants);
  };

  const handleAddVariant = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setEditingVariants([...editingVariants, { id: newId, name: 'New Variant', price: 0, stock: 'In Stock' }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...editingVariants];
    newVariants.splice(index, 1);
    setEditingVariants(newVariants);
  };

  const handleSaveVariants = () => {
    if (editingProductId) {
      updateProductVariants(editingProductId, editingVariants);
      if (editingProductDetails) {
        updateProduct(editingProductId, {
          title: editingProductDetails.title,
          category: editingProductDetails.category,
          basePrice: editingProductDetails.basePrice,
          image: editingProductDetails.image,
          images: editingProductDetails.images,
          folder: editingProductDetails.folder,
          description: editingProductDetails.description
        });
      }
      setEditingProductId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = false) => {
    const files = e.target.files;
    if (!files) return;
    
    const readPromises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    const newImages = await Promise.all(readPromises);
    
    if (isNew) {
       setNewProduct(prev => ({ 
         ...prev, 
         images: [...((prev as any).images || []), ...newImages],
         image: prev.image || newImages[0] 
       }));
    } else {
       setEditingProductDetails((prev: any) => ({
         ...prev,
         images: [...(prev.images || []), ...newImages],
         image: prev.image || newImages[0]
       }));
    }
  };

  const renderProductEditor = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return null;

    return (
      <div className="bg-surface-container border border-primary/30 rounded-xl overflow-hidden mt-4 shadow-lg shadow-primary/5">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Edit size={16} className="text-primary" />
            Editing Variants for: {product.title}
          </h3>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditingProductId(null)}
              className="text-on-surface-variant hover:text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
            >
              <X size={16} /> Cancel
            </button>
            <button type="button" onClick={handleSaveVariants}
              className="bg-primary text-on-primary hover:bg-primary-container px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4 border-b border-white/5">
          <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Product Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Title</label>
              <input type="text" value={editingProductDetails?.title || ''} onChange={(e) => setEditingProductDetails({...editingProductDetails, title: e.target.value})} className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Section (Folder)</label>
              <input type="text" value={editingProductDetails?.folder || ''} onChange={(e) => setEditingProductDetails({...editingProductDetails, folder: e.target.value})} className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-white text-sm" list="edit-folder-options" />
              <datalist id="edit-folder-options">
                {Array.from(new Set(mockProducts.map(p => p.folder).filter(Boolean))).map((folder, idx) => (
                  <option key={idx} value={folder} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Base Price (৳)</label>
              <input type="number" value={editingProductDetails?.basePrice || 0} onChange={(e) => setEditingProductDetails({...editingProductDetails, basePrice: parseFloat(e.target.value) || 0})} className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Image URL / Upload</label>
              <div className="flex gap-2">
                <input type="text" value={editingProductDetails?.image || ''} onChange={(e) => setEditingProductDetails({...editingProductDetails, image: e.target.value})} className="flex-1 bg-surface border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Image URL..." />
                <label className="bg-primary/20 text-primary px-3 py-2 rounded border border-primary/30 hover:bg-primary/30 cursor-pointer flex items-center justify-center transition-colors">
                  <Upload size={16} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, false)} />
                </label>
              </div>
              {editingProductDetails?.images && editingProductDetails.images.length > 0 && (
                 <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                   {editingProductDetails.images.map((img: string, idx: number) => (
                     <div key={idx} className="relative w-12 h-12 flex-shrink-0 group">
                       <img src={img} className="w-full h-full object-cover rounded border border-white/10" alt="" />
                       <button type="button" onClick={() => {
                          const newImages = [...editingProductDetails.images];
                          newImages.splice(idx, 1);
                          setEditingProductDetails({...editingProductDetails, images: newImages, image: newImages[0] || editingProductDetails.image});
                       }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                         <X size={10} />
                       </button>
                     </div>
                   ))}
                 </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-on-surface-variant mb-1">Description (Optional)</label>
              <textarea value={editingProductDetails?.description || ''} onChange={(e) => setEditingProductDetails({...editingProductDetails, description: e.target.value})} className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-white text-sm min-h-[100px]" placeholder="Add product details..." />
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Variants</h4>
          <button type="button" onClick={handleAddVariant}
            className="w-full py-3 border border-dashed border-white/20 rounded-lg text-on-surface-variant hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 mb-4 text-sm"
          >
            <Plus size={16} /> Add New Variant
          </button>
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-on-surface-variant mb-2 px-2">
            <div className="col-span-5">Variant Name</div>
            <div className="col-span-3">Price ($ / BDT)</div>
            <div className="col-span-3">Stock Status</div>
            <div className="col-span-1"></div>
          </div>
          {editingVariants.map((variant, index) => (
            <div key={variant.id} className="grid grid-cols-12 gap-4 items-center bg-white/5 p-2 rounded-lg">
              <div className="col-span-5">
                <input 
                  type="text" 
                  value={variant.name}
                  onChange={(e) => handleUpdateVariant(index, 'name', e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div className="col-span-3">
                <input 
                  type="number" 
                  value={variant.price || ''}
                  onChange={(e) => handleUpdateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div className="col-span-3">
                <select 
                  value={variant.stock}
                  onChange={(e) => handleUpdateVariant(index, 'stock', e.target.value)}
                  className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                >
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div className="col-span-1 flex justify-center">
                <button type="button" onClick={() => handleRemoveVariant(index)}
                  className="p-2 text-on-surface-variant hover:text-red-500 rounded transition-colors"
                  title="Remove Variant"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    );
  };

  const renderProductItem = (product: any) => (
    <div key={product.id} className="flex flex-col p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            {product.image && <img src={product.image} alt={product.title} className="w-10 h-10 rounded object-cover" />}
            <span className="text-white font-bold text-lg">{product.title}</span>
          </div>
          <span className="text-on-surface-variant text-sm flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{product.category}</span>
            • {product.variants.length} Variants
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleEditVariants(product.id)}
            className={`px-4 py-2 rounded flex items-center gap-2 transition-colors text-sm font-medium ${
              editingProductId === product.id 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {editingProductId === product.id ? 'Close Editor' : 'Manage Details'} 
            {editingProductId === product.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); removeProduct(product.id); }}
            className="p-2 text-on-surface-variant hover:text-red-500 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

      </div>
      
      <AnimatePresence>
        {editingProductId === product.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {renderProductEditor(product.id)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-[#0a0616] flex justify-center items-center text-white">Loading...</div>;
  if (!isStaff) return (
    <div className="min-h-screen bg-[#0a0616] flex flex-col justify-center items-center text-white p-4 text-center">
      <div className="text-red-500 font-bold text-2xl mb-4">Access Denied</div>
      <p className="text-on-surface-variant max-w-md">
        You do not have permission to view the Admin Dashboard.
      </p>
      <p className="text-on-surface-variant max-w-md mt-2">
        If you were recently added as a Moderator, make sure you are signed in with the exact email address that was granted access.
      </p>
    </div>
  );

  const completedOrdersTotal = orders.filter((o: Order) => o.status === 'Completed').reduce((sum: number, o: Order) => sum + o.amount, 0);

  const stats = [
    { label: 'Total Revenue', value: `৳${completedOrdersTotal.toFixed(2)}`, trend: '+15%', color: 'text-green-500' },
    { label: 'Total Orders', value: orders.length.toString(), trend: '+5%', color: 'text-blue-500' },
    { label: 'Active Users', value: Array.from(new Set(orders.map((o: Order) => o.email))).length.toString(), trend: '+12%', color: 'text-purple-500' },
    { label: 'Products', value: mockProducts.length.toString(), trend: '+2%', color: 'text-gray-400' },
  ];

  const recentOrders = orders.slice(0, 5).map((o: Order) => ({
    id: o.id,
    user: o.user,
    product: o.items.map(item => item.title).join(', '),
    date: o.date,
    amount: o.amount,
    status: o.status
  }));

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <button 
          onClick={() => {
            if (confirmAction === 'reset') {
              localStorage.clear();
              window.location.reload();
            } else {
              setConfirmAction('reset');
            }
          }}
          onBlur={() => setConfirmAction(null)}
          className="bg-red-500/20 text-red-500 hover:bg-red-500/30 px-4 py-2 rounded-md font-bold text-sm transition-colors"
        >
          {confirmAction === 'reset' ? 'Click to confirm reset!' : 'Reset All Data'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface-container border border-white/5 p-6 rounded-xl">
            <div className="text-on-surface-variant text-sm mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
            <div className={`text-sm ${stat.color}`}>{stat.trend} from last month</div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container border border-white/5 rounded-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Recent Orders</h3>
          <button className="text-primary text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 text-on-surface-variant text-sm text-left">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Product</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-mono">{order.id}</td>
                  <td className="p-4 text-white">{order.user}</td>
                  <td className="p-4 text-on-surface-variant">{order.product}</td>
                  <td className="p-4 text-on-surface-variant">{order.date}</td>
                  <td className="p-4 text-primary">${order.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-max ${
                      order.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                      order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {order.status === 'Completed' && <CheckCircle size={12} />}
                      {order.status === 'Pending' && <Clock size={12} />}
                      {order.status === 'Cancelled' && <XCircle size={12} />}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );

  
  
  const renderHomeSections = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Home Sections</h2>
          <button 
            onClick={() => setIsAddingSection(true)}
            className="bg-primary text-on-primary px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-container transition-colors"
          >
            <Plus size={18} /> Add New Section
          </button>
        </div>

        <div className="space-y-6">
          {homeSections.map(section => (
            <div key={section.id} className="bg-surface-container border border-white/5 rounded-xl overflow-hidden p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-white">{section.title}</h3>
                  <span className="text-on-surface-variant text-sm px-2 py-1 bg-white/5 rounded-full">{section.products.length} Products</span>
                </div>
                <button 
                  onClick={() => {
                    if (confirmAction === `delete_home_${section.id}`) {
                      removeHomeSection(section.id);
                      setConfirmAction(null);
                    } else {
                      setConfirmAction(`delete_home_${section.id}`);
                    }
                  }}
                  onBlur={() => setConfirmAction(null)}
                  className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} /> {confirmAction === `delete_home_${section.id}` ? 'Click to confirm!' : 'Delete Section'}
                </button>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setManagingSectionId(section.id)}
                  className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
                >
                  <Package size={16} /> Manage Products
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>
    );
  };

  const renderProducts = () => {
    const isCategory = ['Top-Up', 'Games', 'Software', 'Subscriptions'].includes(activeTab);
    // Use products from useAdminData, which is destructured as mockProducts
    const displayProducts = mockProducts.filter(p => {
      if (activeTab === 'products') return true;
      if (isCategory) return p.category === activeTab;
      return p.folder === activeTab || p.title === activeTab;
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{activeTab === 'products' ? 'Products' : (activeTab === 'Software' ? 'Gift Cards & Software' : activeTab)} Management</h2>
          <div className="flex items-center gap-3">
            {activeTab !== 'products' && (
              <button 
                onClick={() => {
                  if (confirmAction === `delete_cat_${activeTab}`) {
                    removeProductCategory(activeTab);
                    setActiveTab('products');
                    setConfirmAction(null);
                  } else {
                    setConfirmAction(`delete_cat_${activeTab}`);
                  }
                }}
                onBlur={() => setConfirmAction(null)}
                className="bg-red-500/20 text-red-500 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-500/30 transition-colors"
              >
                <Trash2 size={18} /> {confirmAction === `delete_cat_${activeTab}` ? 'Click to confirm!' : 'Delete Section'}
              </button>
            )}
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-container transition-colors"
            >
              <Plus size={18} /> Add New Item
            </button>
          </div>
        </div>
        <div className="bg-surface-container border border-white/5 rounded-xl overflow-hidden">
          {displayProducts.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">
              No products found in this category.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {displayProducts.map(renderProductItem)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContacts = () => {
    const handleSaveContacts = async () => {
      setIsSavedContacts(true);
      await updateSettings({ contactInfo: editingContacts });
      setTimeout(() => setIsSavedContacts(false), 2000);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Contact Information Settings</h2>
        
        <div className="bg-surface-container border border-white/5 rounded-xl p-6">
          <p className="text-on-surface-variant mb-6 text-sm">
            Update the contact links displayed in the support page and footer. 
            Ensure URLs are complete (e.g. https://wa.me/..., mailto:..., https://discord.gg/...).
          </p>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-white mb-1">WhatsApp Live Chat URL</label>
              <input 
                type="text" 
                value={editingContacts.whatsapp} 
                onChange={(e) => setEditingContacts({...editingContacts, whatsapp: e.target.value})}
                placeholder="https://wa.me/1234567890"
                className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary-fixed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Community Discord URL</label>
              <input 
                type="text" 
                value={editingContacts.discord} 
                onChange={(e) => setEditingContacts({...editingContacts, discord: e.target.value})}
                placeholder="https://discord.gg/example"
                className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary-fixed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email Support</label>
              <input 
                type="text" 
                value={editingContacts.email} 
                onChange={(e) => setEditingContacts({...editingContacts, email: e.target.value})}
                placeholder="mailto:support@example.com"
                className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary-fixed"
              />
            </div>
          </div>
          <button
            onClick={handleSaveContacts}
            className="mt-6 px-6 py-2 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors flex items-center gap-2"
          >
            {isSavedContacts ? <CheckCircle size={18} /> : <Save size={18} />}
            {isSavedContacts ? 'Saved!' : 'Save Contacts'}
          </button>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const handleUpdatePaymentMethod = (index: number, field: keyof PaymentMethodConfig, value: string) => {
      const updated = [...editingPaymentMethods];
      updated[index] = { ...updated[index], [field]: value };
      setEditingPaymentMethods(updated);
    };

    const handleAddPaymentMethod = () => {
      setEditingPaymentMethods([
        ...editingPaymentMethods,
        { method: 'New Method', number: '', type: 'Personal', logo: '' }
      ]);
    };

    const handleRemovePaymentMethod = (index: number) => {
      const updated = [...editingPaymentMethods];
      updated.splice(index, 1);
      setEditingPaymentMethods(updated);
    };

    const handleSavePaymentMethods = async () => {
      setIsSavedPayment(true);
      await updateSettings({ paymentMethods: editingPaymentMethods });
      setTimeout(() => {
        setIsSavedPayment(false);
      }, 3000);
    };

    // Preset logos for quick application
    const presetLogos = [
      { name: 'bKash Logo', url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/BKash_Logo.svg' },
      { name: 'Nagad Logo', url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Nagad_Logo.svg' },
      { name: 'Rocket Logo', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Rocket_by_Dutch-Bangla_Bank_Logo_transparent.png' }
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Site Settings</h2>
        
        {/* Delivery Settings */}
        <div className="bg-surface-container border border-white/5 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-2">Delivery Settings</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Set the delivery charge applied to orders during checkout.
          </p>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Delivery Charge (৳)</label>
            <input 
              type="number" 
              value={settings?.deliveryCharge || 0}
              onChange={(e) => updateSettings({ deliveryCharge: parseFloat(e.target.value) || 0 })}
              className="w-full max-w-xs bg-surface-container-high border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Payment Methods Settings */}
        <div className="bg-surface-container border border-white/5 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Payment Methods Settings</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Configure bKash, Nagad, Rocket, or other payment gateways with their respective account details.
              </p>
            </div>
            <button 
              type="button"
              onClick={handleAddPaymentMethod}
              className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus size={16} /> Add Payment Method
            </button>
          </div>

          {isSavedPayment && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 mb-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm flex items-center gap-2 animate-pulse"
            >
              <CheckCircle size={16} /> Payment settings updated successfully in database!
            </motion.div>
          )}

          <div className="space-y-4 mt-6">
            {editingPaymentMethods.map((method, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4 relative">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">
                    Method #{index + 1}: {method.method || 'New Method'}
                  </span>
                  <button 
                    type="button"
                    onClick={() => handleRemovePaymentMethod(index)}
                    className="text-on-surface-variant hover:text-red-500 p-1.5 rounded hover:bg-white/5 transition-colors"
                    title="Remove Payment Method"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Method Name */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Gateway Name</label>
                    <input 
                      type="text" 
                      required
                      value={method.method}
                      onChange={(e) => handleUpdatePaymentMethod(index, 'method', e.target.value)}
                      placeholder="e.g. bKash"
                      className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Number */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Mobile/Account Number</label>
                    <input 
                      type="text" 
                      required
                      value={method.number}
                      onChange={(e) => handleUpdatePaymentMethod(index, 'number', e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary font-mono font-bold text-primary"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Account Type</label>
                    <select
                      value={method.type}
                      onChange={(e) => handleUpdatePaymentMethod(index, 'type', e.target.value as any)}
                      className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary font-semibold"
                    >
                      <option value="Personal">Personal (Send Money)</option>
                      <option value="Agent">Agent (Cash Out)</option>
                      <option value="Merchant">Merchant (Payment)</option>
                    </select>
                  </div>

                  {/* Logo URL */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Logo URL (Optional)</label>
                    <input 
                      type="text" 
                      value={method.logo || ''}
                      onChange={(e) => handleUpdatePaymentMethod(index, 'logo', e.target.value)}
                      placeholder="e.g. https://example.com/logo.png"
                      className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary truncate"
                    />
                  </div>
                </div>

                {/* Logo Presets Helper & Logo Preview */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface-variant font-semibold">Presets:</span>
                    {presetLogos.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleUpdatePaymentMethod(index, 'logo', preset.url)}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-2 py-0.5 rounded text-[10px] transition-all font-medium cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                    {method.logo && (
                      <button
                        type="button"
                        onClick={() => handleUpdatePaymentMethod(index, 'logo', '')}
                        className="text-red-400 hover:underline text-[10px] cursor-pointer"
                      >
                        Clear Logo
                      </button>
                    )}
                  </div>

                  {method.logo && (
                    <div className="flex items-center gap-2 bg-[#0c081d] border border-white/10 rounded px-2 py-1">
                      <span className="text-on-surface-variant font-semibold text-[10px]">Logo Preview:</span>
                      <img 
                        src={method.logo} 
                        alt="Preview" 
                        className="h-5 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {editingPaymentMethods.length === 0 && (
              <div className="p-8 text-center text-on-surface-variant border border-dashed border-white/10 rounded-xl">
                No active payment methods configured. Click "Add Payment Method" to configure bKash, Nagad, or Rocket.
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleSavePaymentMethods}
              className="bg-primary hover:bg-primary-container text-on-primary font-bold px-6 py-2.5 rounded-md text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Save size={16} /> Save Payment Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveSliderItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = settings?.featuredGames && settings.featuredGames.length > 0
      ? [...settings.featuredGames]
      : [...(defaultSettings.featuredGames || [])];
    
    const itemData: FeaturedGame = {
      title: sliderForm.title,
      tagline: sliderForm.tagline,
      description: sliderForm.description,
      price: Number(sliderForm.price) || 0,
      image: sliderForm.image
    };

    if (editingSliderIndex !== null) {
      // Update existing
      currentList[editingSliderIndex] = itemData;
      setEditingSliderIndex(null);
    } else {
      // Add new
      currentList.push(itemData);
      setIsAddingSliderItem(false);
    }
    
    await updateSettings({ featuredGames: currentList });
    setSliderForm({ title: '', tagline: '', description: '', price: 0, image: '' });
  };

  const handleEditSliderItem = (index: number) => {
    const currentList = settings?.featuredGames && settings.featuredGames.length > 0
      ? settings.featuredGames
      : defaultSettings.featuredGames || [];
    const item = currentList[index];
    if (item) {
      setSliderForm({
        title: item.title,
        tagline: item.tagline || '',
        description: item.description || '',
        price: item.price || 0,
        image: item.image || ''
      });
      setEditingSliderIndex(index);
      setIsAddingSliderItem(true);
    }
  };

  const handleDeleteSliderItem = async (index: number) => {
    const currentList = settings?.featuredGames && settings.featuredGames.length > 0
      ? [...settings.featuredGames]
      : [...(defaultSettings.featuredGames || [])];
    currentList.splice(index, 1);
    await updateSettings({ featuredGames: currentList });
  };

  const handleMoveSliderItem = async (index: number, direction: 'up' | 'down') => {
    const currentList = settings?.featuredGames && settings.featuredGames.length > 0
      ? [...settings.featuredGames]
      : [...(defaultSettings.featuredGames || [])];
    if (direction === 'up' && index > 0) {
      const temp = currentList[index];
      currentList[index] = currentList[index - 1];
      currentList[index - 1] = temp;
    } else if (direction === 'down' && index < currentList.length - 1) {
      const temp = currentList[index];
      currentList[index] = currentList[index + 1];
      currentList[index + 1] = temp;
    }
    await updateSettings({ featuredGames: currentList });
  };

  const renderFeaturedSlider = () => {
    const currentList = settings?.featuredGames && settings.featuredGames.length > 0 
      ? settings.featuredGames 
      : defaultSettings.featuredGames || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Hero Showcase Slider</h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Customize the interactive cards and sliders displayed at the very top of your homepage.
            </p>
          </div>
          {!isAddingSliderItem && (
            <button 
              type="button"
              onClick={() => {
                setEditingSliderIndex(null);
                setSliderForm({ title: '', tagline: '', description: '', price: 0, image: '' });
                setIsAddingSliderItem(true);
              }}
              className="bg-primary text-on-primary px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-container transition-colors font-bold text-sm shadow-md"
            >
              <Plus size={18} /> Add Slider Card
            </button>
          )}
        </div>

        {isAddingSliderItem ? (
          <form onSubmit={handleSaveSliderItem} className="bg-surface-container border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingSliderIndex !== null ? 'Edit Slider Card' : 'Add New Slider Card'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Card Title</label>
                <input 
                  type="text" 
                  required
                  value={sliderForm.title}
                  onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value })}
                  placeholder="e.g. Starlink Battle"
                  className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Tagline / Label</label>
                <input 
                  type="text" 
                  required
                  value={sliderForm.tagline}
                  onChange={(e) => setSliderForm({ ...sliderForm, tagline: e.target.value })}
                  placeholder="e.g. SEASON 3"
                  className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Price / Cost (৳ or $)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={sliderForm.price || ''}
                  onChange={(e) => setSliderForm({ ...sliderForm, price: parseFloat(e.target.value) || 0 || 0 })}
                  placeholder="e.g. 14.99"
                  className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Card Image URL</label>
                <input 
                  type="url" 
                  required
                  value={sliderForm.image}
                  onChange={(e) => setSliderForm({ ...sliderForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Card Description</label>
              <textarea 
                required
                rows={3}
                value={sliderForm.description}
                onChange={(e) => setSliderForm({ ...sliderForm, description: e.target.value })}
                placeholder="Command your fleet in epic space battles and conquer the galaxy..."
                className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white resize-none focus:outline-none focus:border-primary"
              />
            </div>

            {sliderForm.image && (
              <div className="border border-white/10 rounded-lg p-2 bg-[#0c081d] max-w-sm">
                <p className="text-xs text-on-surface-variant mb-1 font-semibold">Image Preview:</p>
                <img src={sliderForm.image} className="w-full h-32 object-cover rounded" alt="preview" onError={(e)=>{(e.target as HTMLElement).style.display='none'}}/>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button 
                type="button"
                onClick={() => {
                  setIsAddingSliderItem(false);
                  setEditingSliderIndex(null);
                }}
                className="bg-white/5 text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-1"
              >
                <Save size={16} /> Save Card
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-surface-container border border-white/5 rounded-xl overflow-hidden">
            {currentList.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant">
                No active slider items. Add one above!
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {currentList.map((item, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-on-surface-variant font-mono text-sm w-4 text-center">{idx + 1}</div>
                      <img src={item.image} className="w-12 h-16 object-cover rounded border border-white/10 bg-black flex-shrink-0" alt="" />
                      <div className="text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-white font-bold">{item.title}</h4>
                          <span className="text-[10px] bg-primary/20 text-primary border border-primary/20 rounded px-1.5 py-0.5 uppercase font-semibold">
                            {item.tagline}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-xs line-clamp-1 mt-1 max-w-[400px] sm:max-w-[500px]">
                          {item.description}
                        </p>
                        <span className="text-primary text-xs font-semibold mt-1 block">Price: {item.price === 0 ? 'Free' : `৳${item.price}`}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <div className="flex gap-1 mr-2">
                        <button 
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSliderItem(idx, 'up')}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-on-surface disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          type="button"
                          disabled={idx === currentList.length - 1}
                          onClick={() => handleMoveSliderItem(idx, 'down')}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-on-surface disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <button 
                        type="button"
                        onClick={() => handleEditSliderItem(idx)}
                        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit Card"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (confirmAction === `delete_slider_${idx}`) {
                            handleDeleteSliderItem(idx);
                            setConfirmAction(null);
                          } else {
                            setConfirmAction(`delete_slider_${idx}`);
                          }
                        }}
                        onBlur={() => setConfirmAction(null)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors flex items-center gap-1 text-xs"
                        title="Delete Card"
                      >
                        <Trash2 size={16} />
                        {confirmAction === `delete_slider_${idx}` && <span className="font-semibold text-red-500">Confirm?</span>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-[#0a0616] flex justify-center items-center text-white">Loading...</div>;
  if (!isStaff) return <div className="min-h-screen bg-[#0a0616] flex justify-center items-center text-red-500 font-bold text-xl">Access Denied</div>;

  return (
    <div className="h-screen bg-[#0a0616] pt-24 pb-6 overflow-hidden flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 flex-1 min-h-0">
        
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6 overflow-y-auto hide-scrollbar pb-10 pr-2">
          
          <div className="space-y-2">
            {role === 'Admin' && (<button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>)}
          </div>
          
          <div className="space-y-2">
            {role === 'Admin' && (<button 
              onClick={() => setActiveTab('home_sections')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'home_sections' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <Folder size={20} />
              <span className="font-medium">Section</span>
            </button>)}

            {role === 'Admin' && (<button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <Package size={20} />
              <span className="font-medium">Product</span>
            </button>)}
            <div className="px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-4">
              Product Categories
            </div>
            {(() => {
              const uniqueSections = new Set<string>(['Top-Up', 'Games', 'Software', 'Subscriptions']);
              const sections = [
                { id: 'Top-Up', name: 'Top-Up', isFolder: false },
                { id: 'Games', name: 'Games', isFolder: false },
                { id: 'Software', name: 'Gift Cards & Software', isFolder: false },
                { id: 'Subscriptions', name: 'Subscriptions', isFolder: false }
              ];
              
              mockProducts.forEach(p => {
                const sectionName = p.folder;
                if (sectionName && !uniqueSections.has(sectionName)) {
                  uniqueSections.add(sectionName);
                  sections.push({ id: sectionName, name: sectionName, isFolder: true });
                }
              });

              return sections.map(section => (
                <button 
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === section.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
                >
                  {section.isFolder ? <Folder size={18} /> : <Package size={18} />}
                  <span className="font-medium truncate">{section.name}</span>
                </button>
              ));
            })()}
          </div>

          <div className="space-y-2">
            <div className="px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              System
            </div>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <ShoppingCart size={20} />
              <span className="font-medium">Orders</span>
            </button>
            {isSuperAdmin && (<button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <Users size={20} />
              <span className="font-medium">Users</span>
            </button>)}
            {role === 'Admin' && (<button 
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'contacts' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <Mail size={20} />
              <span className="font-medium">Contacts</span>
            </button>)}
            {role === 'Admin' && (<button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>)}
            {role === 'Admin' && (<button 
              onClick={() => setActiveTab('featured_slider')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'featured_slider' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <Tv size={20} />
              <span className="font-medium">Featured Slider</span>
            </button>)}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 overflow-y-auto hide-scrollbar pb-10 pl-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'home_sections' && renderHomeSections()}
              {['products', 'Top-Up', 'Games', 'Software', 'Subscriptions', ...Array.from(new Set(mockProducts.map(p => p.folder || p.title)))].includes(activeTab) && renderProducts()}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Orders Management</h2>
                    <span className="text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5 text-on-surface-variant">
                      Total Orders: <strong className="text-white font-bold">{orders.length}</strong>
                    </span>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="p-12 text-center bg-surface-container border border-white/5 rounded-xl text-on-surface-variant">
                      No orders found. Completed checkouts will appear here!
                    </div>
                  ) : (
                    <div className="bg-surface-container border border-white/5 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-white/5 text-on-surface-variant text-sm border-b border-white/5">
                            <tr>
                              <th className="p-4">ID / Date</th>
                              <th className="p-4">Customer</th>
                              <th className="p-4">Products</th>
                              <th className="p-4">Payment</th>
                              <th className="p-4">Amount</th>
                              <th className="p-4">Status</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {orders.map((order: Order) => (
                              <tr key={order.id} className="hover:bg-white/5 transition-colors text-sm">
                                <td className="p-4">
                                  <div className="text-white font-mono font-bold">{order.id}</div>
                                  <div className="text-on-surface-variant text-xs mt-1">{order.date}</div>
                                </td>
                                <td className="p-4">
                                  <div className="text-white font-semibold">{order.user}</div>
                                  <div className="text-on-surface-variant text-xs mt-0.5">{order.email}</div>
                                  {order.phone && (
                                    <div className="text-primary text-xs mt-0.5 font-mono">{order.phone}</div>
                                  )}
                                </td>
                                <td className="p-4 max-w-xs">
                                  <div className="text-white text-xs space-y-1">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="bg-white/5 px-2 py-1 rounded border border-white/5 font-medium">
                                        {item.title}
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded ${
                                    order.paymentMethod === 'bKash' ? 'bg-[#e2136e]/20 text-[#e2136e]' :
                                    order.paymentMethod === 'Nagad' ? 'bg-[#f7941d]/20 text-[#f7941d]' :
                                    'bg-blue-500/20 text-blue-500'
                                  }`}>
                                    {order.paymentMethod || 'Card'}
                                  </span>
                                  {order.transactionId && (
                                    <div className="text-xs text-on-surface-variant mt-1.5 font-mono">
                                      <span className="opacity-70">TrxID:</span> {order.transactionId}
                                    </div>
                                  )}
                                  {order.senderNumber && (
                                    <div className="text-xs text-on-surface-variant mt-0.5 font-mono">
                                      <span className="opacity-70">Sender:</span> {order.senderNumber}
                                    </div>
                                  )}
                                </td>
                                <td className="p-4 text-primary font-bold">
                                  ৳{order.amount.toFixed(2)}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 w-max ${
                                    order.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                    order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                    'bg-red-500/20 text-red-500'
                                  }`}>
                                    {order.status === 'Completed' && <CheckCircle size={12} />}
                                    {order.status === 'Pending' && <Clock size={12} />}
                                    {order.status === 'Cancelled' && <XCircle size={12} />}
                                    {order.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  {order.status === 'Pending' ? (
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                                        className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'Pending')}
                                      className="text-on-surface-variant hover:text-white hover:bg-white/5 border border-white/10 text-xs px-3 py-1.5 rounded transition-all"
                                    >
                                      Set to Pending
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
                            {activeTab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Users Management</h2>
                  
                  {isSuperAdmin ? (
                    <div className="bg-surface-container border border-white/5 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-2">Staff Roles</h3>
                      <p className="text-sm text-yellow-500/90 mb-4 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                        <strong>Important:</strong> Adding an email here only grants permission. The user must independently "Sign Up" for an account on the website using this email address to log in.
                      </p>
                      
                      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                        <div>
                          <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
                          <input 
                            type="email" 
                            value={newStaffEmail}
                            onChange={(e) => setNewStaffEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full bg-surface-container-high border border-white/10 rounded-md px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-on-surface-variant mb-1">Role</label>
                          <select
                            value={newStaffRole}
                            onChange={(e) => setNewStaffRole(e.target.value as any)}
                            className="w-full bg-[#110c24] border border-white/10 rounded-md px-3 py-2 text-white"
                          >
                            <option value="Admin">Admin (Full Access)</option>
                            <option value="Moderator">Moderator (Orders Only)</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              if (!newStaffEmail) return;
                              const newStaff = [...(settings?.staff || [])];
                              const existingIndex = newStaff.findIndex(s => s.email === newStaffEmail);
                              if (existingIndex >= 0) {
                                newStaff[existingIndex].role = newStaffRole;
                              } else {
                                newStaff.push({ email: newStaffEmail, role: newStaffRole });
                              }
                              updateSettings({ staff: newStaff });
                              setNewStaffEmail('');
                            }}
                            className="w-full bg-primary hover:bg-primary/90 text-[#0a0616] font-bold px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus size={18} />
                            Add/Update
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {settings?.staff?.map((staff) => (
                          <div key={staff.email} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div>
                              <p className="font-bold text-white">{staff.email}</p>
                              <span className={`text-xs font-mono uppercase px-2 py-1 rounded ${staff.role === 'Admin' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                                {staff.role}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                if (staff.email === 'abubokkorbaqi@gmail.com') return; // Cannot delete superadmin
                                const newStaff = settings.staff.filter(s => s.email !== staff.email);
                                updateSettings({ staff: newStaff });
                              }}
                              disabled={staff.email === 'abubokkorbaqi@gmail.com'}
                              className={`p-2 rounded-md transition-colors ${staff.email === 'abubokkorbaqi@gmail.com' ? 'opacity-50 cursor-not-allowed' : 'text-red-400 hover:bg-red-400/10'}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                        {(!settings?.staff || settings.staff.length === 0) && (
                          <div className="p-4 text-center text-on-surface-variant">No staff members found.</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-surface-container border border-white/5 rounded-xl text-on-surface-variant">
                      <p>You do not have permission to manage users.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'contacts' && renderContacts()}
              {activeTab === 'settings' && renderSettings()}
              {activeTab === 'featured_slider' && renderFeaturedSlider()}
            </motion.div>
          </AnimatePresence>
        </div>

      
      <AnimatePresence>
        {isAddingSection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface-container border border-white/10 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Section Name</label>
                  <input 
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Flash Sales"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button 
                  onClick={() => setIsAddingSection(false)}
                  className="px-4 py-2 text-on-surface-variant hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (newSectionName.trim()) {
                      addHomeSection(newSectionName);
                      setNewSectionName('');
                      setIsAddingSection(false);
                    }
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors"
                >
                  Add Section
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {managingSectionId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface-container border border-white/10 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  Manage Products in {homeSections.find(s => s.id === managingSectionId)?.title}
                </h3>
                <button onClick={() => setManagingSectionId(null)} className="text-on-surface-variant hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-on-surface-variant mb-2 px-2 sticky top-0 bg-surface-container z-10 py-2">
                  <div className="col-span-4">Product Title</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2 truncate">Image</div>
                  <div className="col-span-1"></div>
                </div>
                
                {homeSections.find(s => s.id === managingSectionId)?.products.map(prod => (
                  <div key={prod.id} className="grid grid-cols-12 gap-4 items-center bg-white/5 p-2 rounded-lg">
                    <div className="col-span-4 text-white text-sm truncate">{prod.title}</div>
                    <div className="col-span-3 text-white text-sm truncate">{prod.type}</div>
                    <div className="col-span-2 text-white text-sm">৳{prod.price}</div>
                    <div className="col-span-2 truncate text-xs text-on-surface-variant">{prod.image}</div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => removeProductFromSection(managingSectionId, prod.id)}
                        className="text-on-surface-variant hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {homeSections.find(s => s.id === managingSectionId)?.products.length === 0 && (
                  <div className="text-center text-on-surface-variant py-8 bg-white/5 rounded-lg border border-white/5">
                    No products in this section yet.
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <button 
                  onClick={() => setIsAddingSectionProduct(managingSectionId)}
                  className="w-full py-3 border border-dashed border-white/20 rounded-lg text-on-surface-variant hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <Plus size={18} /> Add New Product to Section
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAddingProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface-container border border-white/10 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New Item</h3>
              
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Title</label>
                  <input 
                    type="text"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                    className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="Item name..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Category (Type)</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    >
                      <option>Top-Up</option>
                      <option>Games</option>
                      <option value="Software">Gift Cards & Software</option>
                      <option>Subscriptions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Section (Folder)</label>
                    <input 
                      type="text"
                      value={newProduct.folder}
                      onChange={(e) => setNewProduct({...newProduct, folder: e.target.value})}
                      className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. Free Fire TopUp"
                      list="folder-options"
                    />
                    <datalist id="folder-options">
                      {Array.from(new Set(mockProducts.map(p => p.folder).filter(Boolean))).map((folder, idx) => (
                        <option key={idx} value={folder} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Base Price (৳)</label>
                  <input 
                    type="number"
                    value={newProduct.basePrice || ''}
                    onChange={(e) => setNewProduct({...newProduct, basePrice: parseFloat(e.target.value) || 0})}
                    className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Image URL / Upload</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="flex-1 bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                      placeholder="Image URL..."
                    />
                    <label className="bg-primary/20 text-primary px-3 py-2 rounded border border-primary/30 hover:bg-primary/30 cursor-pointer flex items-center justify-center transition-colors">
                      <Upload size={16} />
                      <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
                    </label>
                  </div>
                  {(newProduct as any).images && (newProduct as any).images.length > 0 && (
                     <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                       {(newProduct as any).images.map((img: string, idx: number) => (
                         <div key={idx} className="relative w-12 h-12 flex-shrink-0 group">
                           <img src={img} className="w-full h-full object-cover rounded border border-white/10" alt="" />
                           <button type="button" onClick={() => {
                              const newImages = [...(newProduct as any).images];
                              newImages.splice(idx, 1);
                              setNewProduct({...newProduct, images: newImages, image: newImages[0] || newProduct.image} as any);
                           }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                             <X size={10} />
                           </button>
                         </div>
                       ))}
                     </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Description (Optional)</label>
                  <textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary min-h-[100px]"
                    placeholder="Product details..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">

                <button 
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 text-on-surface-variant hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const isCategory = ['Top-Up', 'Games', 'Software', 'Subscriptions'].includes(activeTab);
                    addProduct({ 
                      ...newProduct, 
                      folder: newProduct.folder || ((!isCategory && activeTab !== 'products') ? activeTab : undefined)
                    });
                    
                    setIsAddingProduct(false);
                    setNewProduct({ title: '', category: 'Top-Up', basePrice: 0, image: '', folder: '', description: '', images: [] });

                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors"
                >
                  Add Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingSectionProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface-container border border-white/10 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add Product to Section</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Title</label>
                  <input 
                    type="text"
                    value={newSectionProduct.title}
                    onChange={(e) => setNewSectionProduct({...newSectionProduct, title: e.target.value})}
                    className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Free Fire 100 Diamonds"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Type (Tag)</label>
                  <input 
                    type="text"
                    value={newSectionProduct.type}
                    onChange={(e) => setNewSectionProduct({...newSectionProduct, type: e.target.value})}
                    className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Top-Up"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Price</label>
                  <input 
                    type="number"
                    value={newSectionProduct.price || ''}
                    onChange={(e) => setNewSectionProduct({...newSectionProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Image URL</label>
                  <input 
                    type="text"
                    value={newSectionProduct.image}
                    onChange={(e) => setNewSectionProduct({...newSectionProduct, image: e.target.value})}
                    className="w-full bg-[#110c24] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6 justify-end">
                <button 
                  onClick={() => setIsAddingSectionProduct(null)}
                  className="px-4 py-2 text-on-surface-variant hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (newSectionProduct.title.trim()) {
                      addProductToSection(isAddingSectionProduct, newSectionProduct);
                      setNewSectionProduct({ title: '', type: 'Top-Up', price: 0, image: '' });
                      setIsAddingSectionProduct(null);
                    }
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors"
                >
                  Add Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    </div>
  );
}
