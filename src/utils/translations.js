import { useI18nStore } from '../stores/i18nStore'

const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.customize': 'Customize',
  'nav.history': 'History',
  'nav.settings': 'Settings',

  // Home Page
  'home.title': 'Fatma Shooting Studio',
  'home.subtitle': 'Upload your garment and generate professional e-commerce photos instantly',
  'home.create_magic': 'Create Magic',
  'home.view_history': 'View History',
  'home.continue': 'Continue',
  'home.professional': 'Professional',

  // Settings Page
  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.theme': 'Theme Toggle',
  'settings.language': 'Language / Langue',
  'settings.apikey.title': 'Gemini API Key',
  'settings.apikey.configured': 'API key configured',
  'settings.apikey.missing': 'No API key — generation will not work',
  'settings.apikey.placeholder': 'Enter Gemini API key...',
  'settings.install.title': 'Install App',
  'settings.install.desc': 'Install Fatma Shooting Studio to your home screen for full-screen experience and quick access.',
  'settings.install.button': 'Install Now',
  'settings.install.safari': 'Open in Safari (iOS) or Chrome (Android) to install.',
  'settings.install.installed': 'App installed',
  'settings.data.title': 'Data',
  'settings.data.saved': 'generation(s) saved',
  'settings.data.clear': 'Clear History',
  'settings.about.title': 'Fatma Shooting Studio',
  'settings.about.subtitle': 'Fashion Photography Studio',

  // Customize Page
  'customize.title': 'Customization',
  'customize.mode.model': 'Model Only',
  'customize.mode.product': 'Product Only',
  'customize.mode.both': 'Model + Product',
  'customize.prompt.model': 'Describe the model, pose, and aesthetic...',
  'customize.prompt.product': 'Describe the garment, fabric, and details...',
  'customize.upload.empty': 'Add some photos to ground the generation...',
  'customize.upload.button': 'Add Photos',
  'customize.section.style': 'Style & Model',
  'customize.section.garment': 'Garment Details',
  'customize.section.options': 'Options',
  'customize.options.cache': 'Use Cache',
  'customize.options.cache.desc': 'Reuse recent identical results instantly',
  'customize.options.search': 'Google Search Grounding',
  'customize.options.search.desc': 'Anchor environment to current architectural trends',
  'customize.button.generate': 'Create Magic',

  // Constants (Labels)
  'label.ethnicity': 'Ethnicity',
  'label.environment': 'Environment',
  'label.product_style': 'Product Style',
  'label.brand_inspiration': 'Brand Inspiration',
  'label.fabric': 'Fabric',
  'label.fit': 'Fit',
  'label.size': 'Size',
  'label.target_market': 'Target Market',
  
  // Results & History Page
  'results.header': 'Your Looks',
  'results.title': 'Looking great!',
  'results.subtitle': 'Your photos are ready',
  'receipt.title': 'Generation Receipt',
  'receipt.pricing': 'Pricing model',
  'receipt.images': 'Images',
  'receipt.tokens': 'Tokens',
  'receipt.total': 'Total',
  'results.total_cost': 'Total Cost',
  'results.estimated_cost': 'Estimated Cost',
  'results.button.regenerate': 'Regenerate',
  'results.button.download': 'Save All',
  'history.title': 'History',
  'history.clear': 'Clear',
  'history.empty': 'No history yet',
  'history.empty.desc': 'Your generated fashion photos will appear here',
  'history.create_first': 'Create your first',
  'history.toast.removed': 'Generation removed',
  'history.toast.cleared': 'History cleared',
  
  'upload.title': 'Add your garment',
  'upload.desc': 'Take a photo or drag & drop up to 4 images',
  'upload.format': 'JPG, PNG, WebP up to 10MB',
  'upload.add_more': 'Add more photos',
  'upload.your_photos': 'Your photos',
  'upload.more_angles': 'More angles = better results',
  'upload.clear_all': 'Clear all',

  'guidelines.title': 'Photo Guidelines',
  'guidelines.flat.title': 'Lay it flat',
  'guidelines.flat.desc': 'Use a clean, flat surface or a ghost mannequin for the best shape.',
  'guidelines.lighting.title': 'Good lighting',
  'guidelines.lighting.desc': 'Ensure bright, even lighting to capture true colors and details.',
  'guidelines.bg.title': 'Clear background',
  'guidelines.bg.desc': 'Use a solid, contrasting background without any clutter.',
  'guidelines.wrinkles.title': 'Smooth wrinkles',
  'guidelines.wrinkles.desc': 'Iron or steam the garment for a flawless, professional finish.',

  // Models
  'model.gemini_3_1_flash': 'Gemini 3.1 Flash Image',
  'model.gemini_3_pro': 'Gemini 3 Pro Image',
  'model.gemini_2_5_flash': 'Gemini 2.5 Flash Image',
  
  // Cost Estimator
  'cost.title': 'Estimated Cost',
  'cost.tokens': 'Tokens',
  
  // Dynamic translations will fallback to the key itself if not found
}

const fr = {
  // Navigation
  'nav.home': 'Accueil',
  'nav.customize': 'Créer',
  'nav.history': 'Historique',
  'nav.settings': 'Paramètres',

  // Home Page
  'home.title': 'Fatma Shooting Studio',
  'home.subtitle': 'Uploadez votre vêtement et générez des photos e-commerce professionnelles instantanément',
  'home.create_magic': 'Créer la Magie',
  'home.view_history': 'Voir l\'Historique',
  'home.continue': 'Continuer',
  'home.professional': 'Professionnel',

  // Settings Page
  'settings.title': 'Paramètres',
  'settings.appearance': 'Apparence',
  'settings.theme': 'Mode sombre / clair',
  'settings.language': 'Langue / Language',
  'settings.apikey.title': 'Clé API Gemini',
  'settings.apikey.configured': 'Clé API configurée',
  'settings.apikey.missing': 'Aucune clé API — la génération ne fonctionnera pas',
  'settings.apikey.placeholder': 'Entrez la clé API Gemini...',
  'settings.install.title': 'Installer l\'App',
  'settings.install.desc': 'Installez Fatma Shooting Studio sur votre écran d\'accueil pour une expérience plein écran.',
  'settings.install.button': 'Installer',
  'settings.install.safari': 'Ouvrez dans Safari (iOS) ou Chrome (Android) pour installer.',
  'settings.install.installed': 'Application installée',
  'settings.data.title': 'Données',
  'settings.data.saved': 'génération(s) sauvegardée(s)',
  'settings.data.clear': 'Effacer l\'historique',
  'settings.about.title': 'Fatma Shooting Studio',
  'settings.about.subtitle': 'Studio de Photographie de Mode',

  // Customize Page
  'customize.title': 'Personnalisation',
  'customize.mode.model': 'Mannequin Seul',
  'customize.mode.product': 'Produit Seul',
  'customize.mode.both': 'Mannequin + Produit',
  'customize.prompt.model': 'Décrivez le mannequin, la pose, l\'esthétique...',
  'customize.prompt.product': 'Décrivez le vêtement, le tissu, les détails...',
  'customize.upload.empty': 'Ajouter des photos de référence...',
  'customize.upload.button': 'Ajouter',
  'customize.section.style': 'Style & Mannequin',
  'customize.section.garment': 'Détails du Vêtement',
  'customize.section.options': 'Options',
  'customize.options.cache': 'Utiliser le Cache',
  'customize.options.cache.desc': 'Réutiliser des résultats identiques instantanément',
  'customize.options.search': 'Google Search Grounding',
  'customize.options.search.desc': 'Ancrer l\'environnement aux tendances actuelles',
  'customize.button.generate': 'Créer la Magie',

  // Constants (Labels)
  'label.ethnicity': 'Origine',
  'label.environment': 'Environnement',
  'label.product_style': 'Style de Produit',
  'label.brand_inspiration': 'Inspiration Marque',
  'label.fabric': 'Tissu',
  'label.fit': 'Coupe',
  'label.size': 'Taille',
  'label.target_market': 'Cible',
  
  // Results & History Page
  'results.header': 'Vos Créations',
  'results.title': 'Magnifique !',
  'results.subtitle': 'Vos photos sont prêtes',
  'receipt.title': 'Reçu de Génération',
  'receipt.pricing': 'Modèle tarifaire',
  'receipt.images': 'Images',
  'receipt.tokens': 'Tokens',
  'receipt.total': 'Total',
  'results.total_cost': 'Coût Total',
  'results.estimated_cost': 'Coût Estimé',
  'results.button.regenerate': 'Regénérer',
  'results.button.download': 'Tout Sauvegarder',
  'history.title': 'Historique',
  'history.clear': 'Effacer',
  'history.empty': 'Aucun historique',
  'history.empty.desc': 'Vos photos de mode apparaîtront ici',
  'history.create_first': 'Créer votre première photo',
  'history.toast.removed': 'Génération supprimée',
  'history.toast.cleared': 'Historique effacé',
  
  'upload.title': 'Ajoutez votre vêtement',
  'upload.desc': 'Prenez une photo ou glissez-déposez jusqu\'à 4 images',
  'upload.format': 'JPG, PNG, WebP jusqu\'à 10MB',
  'upload.add_more': 'Ajouter d\'autres photos',
  'upload.your_photos': 'Vos photos',
  'upload.more_angles': 'Plus d\'angles = meilleurs résultats',
  'upload.clear_all': 'Tout effacer',

  'guidelines.title': 'Conseils Photo',
  'guidelines.flat.title': 'À plat',
  'guidelines.flat.desc': 'Utilisez une surface propre et plane ou un mannequin fantôme.',
  'guidelines.lighting.title': 'Bonne lumière',
  'guidelines.lighting.desc': 'Assurez un éclairage uniforme pour capturer les vraies couleurs.',
  'guidelines.bg.title': 'Fond clair',
  'guidelines.bg.desc': 'Utilisez un fond uni et contrastant, sans objets autour.',
  'guidelines.wrinkles.title': 'Sans plis',
  'guidelines.wrinkles.desc': 'Repassez le vêtement pour un rendu impeccable et professionnel.',

  // Models
  'model.gemini_3_1_flash': 'Gemini 3.1 Flash Image',
  'model.gemini_3_pro': 'Gemini 3 Pro Image',
  'model.gemini_2_5_flash': 'Gemini 2.5 Flash Image',
  
  // Cost Estimator
  'cost.title': 'Coût Estimé',
  'cost.tokens': 'Tokens',
}

const dict = { en, fr }

/**
 * Returns a translation function bound to the current language.
 * Usage: const t = useTranslation(); t('nav.home')
 */
export function useTranslation() {
  const language = useI18nStore((s) => s.language)
  
  return (key, fallback) => {
    // Return translation, or fallback, or the key itself
    return dict[language]?.[key] || dict['en']?.[key] || fallback || key
  }
}
