import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/common/Button'
import { OptionSelector } from '../components/customize/OptionSelector'
import { GarmentPicker } from '../components/customize/GarmentPicker'
import { DropdownPicker } from '../components/customize/DropdownPicker'
import { GenerationModeToggle } from '../components/customize/GenerationModeToggle'
import { CostEstimator } from '../components/customize/CostEstimator'
import { ImagePreview } from '../components/upload/ImagePreview'
import { useGenerationStore } from '../stores/generationStore'
import { useGenerate } from '../hooks/useGenerate'
import { useImageUpload } from '../hooks/useImageUpload'
import { useAutoDetect } from '../hooks/useAutoDetect'
import { Switch } from '../components/common/Switch'
import { useTranslation } from '../utils/translations'
import {
  MODEL_TYPES, ETHNICITIES, ENVIRONMENTS,
  PRODUCT_STYLES, BRAND_STYLES, FABRICS, FITS, SIZES, TARGET_MARKETS, OUTPUT_COUNTS,
  AI_MODEL_OPTIONS, IMAGE_RESOLUTION_OPTIONS, HEADWEAR_OPTIONS,
  getPricingProfile, IMAGE_OUTPUT_TOKENS_BY_MODEL,
} from '../utils/constants.jsx'

function SparklesIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}

function FilmIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  )
}

function CpuIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
    </svg>
  )
}

function ChevronDownIcon({ className, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function WandIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8 19 13" /><path d="M15 9h.01" /><path d="M17.8 6.2 19 5" /><path d="m3 21 9-9" /><path d="M12.2 6.2 11 5" />
    </svg>
  )
}

function LoaderIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export function CustomizePage() {
  const navigate = useNavigate()
  const { generate } = useGenerate()
  const { inputRef, openPicker, handleInputChange } = useImageUpload()
  const { isDetecting, autoFillFromPhoto, detectedCount, markOverridden, isFieldDetected } = useAutoDetect()

  const t = useTranslation()

  const [advancedOpen, setAdvancedOpen] = useState(false)

  const images = useGenerationStore((s) => s.images)
  const options = useGenerationStore((s) => s.options)
  const error = useGenerationStore((s) => s.error)
  const setOption = useGenerationStore((s) => s.setOption)
  const removeImage = useGenerationStore((s) => s.removeImage)

  if (images.length === 0) {
    navigate('/')
    return null
  }

  // Count how many advanced fields are auto-detected
  const advancedDetectedCount = ['brandStyle', 'fabric', 'fit', 'headwear'].filter(
    (f) => isFieldDetected(f)
  ).length

  const handleAutoDetect = () => {
    if (images.length > 0 && images[0].base64) {
      autoFillFromPhoto(images[0].base64)
    }
  }

  // Wrapper that marks a field as overridden when user manually changes it
  const setOptionWithOverride = (key, value) => {
    setOption(key, value)
    if (isFieldDetected(key)) {
      markOverridden(key)
    }
  }

  return (
    <PageTransition>
      <Header title={t('customize.title')} showBack />

      <div className="flex-1 overflow-y-auto px-5 md:px-8 pt-4 pb-44 max-w-3xl mx-auto w-full">
        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-sm text-red-400">
            <span>{error}</span>
          </div>
        )}

        {/* Source images */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--text-muted)' }}>
            {t('upload.your_photos')} ({images.length}/4)
          </h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {images.map((img, idx) => (
              <ImagePreview
                key={idx}
                src={img.preview}
                onRemove={() => removeImage(idx)}
                className="w-20 h-20 shrink-0"
              />
            ))}
            {images.length < 4 && (
              <button
                onClick={openPicker}
                className="w-20 h-20 shrink-0 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-brand hover:border-brand-dark hover:text-brand-dark transition-colors"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                }}
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-[9px] font-bold mt-1">{t('customize.add_image')}</span>
              </button>
            )}
          </div>
        </div>

        {/* ✨ Auto-Detect Button */}
        <div className="mb-6">
          <button
            onClick={handleAutoDetect}
            disabled={isDetecting || images.length === 0}
            className={`w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl border-2 border-dashed transition-all active:scale-[0.98] ${
              isDetecting
                ? 'border-purple-500/40 bg-purple-500/5 cursor-wait'
                : detectedCount > 0
                ? 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 cursor-pointer'
                : 'border-brand/30 bg-brand/5 hover:bg-brand/10 hover:border-brand/50 cursor-pointer'
            }`}
          >
            {isDetecting ? (
              <>
                <LoaderIcon className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">{t('customize.detect.analyzing')}</span>
              </>
            ) : detectedCount > 0 ? (
              <>
                <WandIcon className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">
                  {detectedCount} {t('customize.detect.success')}
                </span>
                <span className="text-[10px] text-purple-400/60">· {t('customize.detect.redetect')}</span>
              </>
            ) : (
              <>
                <WandIcon className="w-4 h-4 text-brand" />
                <span className="text-sm font-semibold text-brand">{t('customize.detect.idle')}</span>
                <span className="text-[10px] theme-text-muted">· {t('customize.detect.powered_by')}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Model Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-1 mb-3">
            <CpuIcon className="w-4 h-4 text-brand" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest theme-text-muted">AI Model</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AI_MODEL_OPTIONS.map((model) => {
              const isActive = options.aiModel === model.value

              const currentRes = options.imageResolution || '1K'
              const tokensPerImage = IMAGE_OUTPUT_TOKENS_BY_MODEL[model.value]?.[currentRes] || 1120
              const profile = getPricingProfile(model.value)
              const rate = profile ? (profile.outputTokenCostMillion || 0) / 1000000 : 0
              const costPerImg = profile && profile.isFlat
                ? profile.flatRateCost
                : tokensPerImage * rate

              const prefix = model.sublabel.split('·')[0].trim()
              const dynamicSublabel = `${prefix} · ~$${costPerImg.toFixed(3)}/img`

              return (
                <button
                  key={model.value}
                  onClick={() => setOption('aiModel', model.value)}
                  className={`relative flex flex-col items-start gap-0.5 p-3 rounded-2xl border transition-all text-left ${isActive
                    ? 'bg-brand/10 border-brand/40 shadow-sm shadow-brand/10'
                    : 'theme-card theme-border hover:opacity-80'
                    }`}
                >
                  {model.recommended && (
                    <span className="absolute top-2 right-2 text-[9px] font-bold text-brand uppercase tracking-wider">
                      ★ Best
                    </span>
                  )}
                  <span className={`text-xs font-bold ${isActive ? 'text-brand-dark' : 'theme-text'}`}>
                    {model.label}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-brand-dark/70' : 'theme-text-sec'}`}>{dynamicSublabel}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            <OptionSelector
              label="Image Resolution"
              options={IMAGE_RESOLUTION_OPTIONS}
              value={options.imageResolution || '1K'}
              onChange={(v) => setOption('imageResolution', v)}
            />
            {options.imageResolution && options.imageResolution !== '1K' && (
              <p className="text-[10px] text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-1.5 mt-2 block w-full">
                💡 1K is usually recommended for optimal speed and cost-effectiveness.
              </p>
            )}
          </div>
        </div>

        {/* Generation Mode */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 px-1 theme-text-muted">
            {t('customize.mode')}
          </h3>
          <GenerationModeToggle
            value={options.mode}
            onChange={(v) => setOption('mode', v)}
          />
        </div>

        <div className="mb-6">
          <OptionSelector
            label="Number of Images"
            options={OUTPUT_COUNTS}
            value={options.outputCount}
            onChange={(v) => setOption('outputCount', v)}
          />
        </div>

        {/* Core Options */}
        <div className="space-y-5">
          <GarmentPicker
            value={options.garmentType}
            onChange={(v) => setOptionWithOverride('garmentType', v)}
            detected={isFieldDetected('garmentType')}
            disabledValues={
              ['model', 'both'].includes(options.mode)
                ? []
                : []
            }
          />

          {(options.mode === 'model' || options.mode === 'both') && (
            <>
              <DropdownPicker
                label="Model"
                options={MODEL_TYPES}
                value={options.modelType}
                onChange={(v) => setOptionWithOverride('modelType', v)}
                detected={isFieldDetected('modelType')}
                onOverride={() => markOverridden('modelType')}
                columns={2}
              />
              <DropdownPicker
                label="Ethnicity / Origin"
                options={ETHNICITIES}
                value={options.ethnicity}
                onChange={(v) => setOption('ethnicity', v)}
                columns={2}
              />
            </>
          )}

          {(options.mode === 'product' || options.mode === 'both') && (
            <DropdownPicker
              label="Product Style"
              options={PRODUCT_STYLES}
              value={options.productStyle}
              onChange={(v) => setOption('productStyle', v)}
              columns={2}
            />
          )}

          <DropdownPicker
            label="Environment"
            options={ENVIRONMENTS}
            value={options.environment}
            onChange={(v) => setOption('environment', v)}
            columns={2}
          />
        </div>

        {/* ─── Advanced Options (Collapsible Accordion) ─── */}
        <div className="mt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full flex items-center justify-between py-5 px-1 group"
          >
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-brand" />
              <h3 className="text-xs font-bold uppercase tracking-widest theme-text-muted">
                Advanced Options
              </h3>
              {advancedDetectedCount > 0 && !advancedOpen && (
                <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-full">
                  🪄 {advancedDetectedCount} detected
                </span>
              )}
            </div>
            <ChevronDownIcon
              className="w-4 h-4 theme-text-muted transition-transform"
              style={{ transform: advancedOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {advancedOpen && (
            <div className="space-y-5 pb-4 animate-in slide-in-from-top-2 duration-200">
              {/* Hijab / Headwear */}
              {(options.mode === 'model' || options.mode === 'both') &&
                !['skirt', 'shorts'].includes(options.garmentType) && (
                <DropdownPicker
                  label="Headwear Styling"
                  options={HEADWEAR_OPTIONS}
                  value={options.headwear}
                  onChange={(v) => setOptionWithOverride('headwear', v)}
                  detected={isFieldDetected('headwear')}
                  onOverride={() => markOverridden('headwear')}
                  columns={2}
                />
              )}

              <DropdownPicker
                label="Brand Inspiration"
                options={BRAND_STYLES}
                value={options.brandStyle}
                onChange={(v) => setOptionWithOverride('brandStyle', v)}
                detected={isFieldDetected('brandStyle')}
                onOverride={() => markOverridden('brandStyle')}
                columns={2}
              />
              <DropdownPicker
                label="Fabric"
                options={FABRICS}
                value={options.fabric}
                onChange={(v) => setOptionWithOverride('fabric', v)}
                detected={isFieldDetected('fabric')}
                onOverride={() => markOverridden('fabric')}
                columns={2}
              />
              <DropdownPicker
                label="Fit"
                options={FITS}
                value={options.fit}
                onChange={(v) => setOptionWithOverride('fit', v)}
                detected={isFieldDetected('fit')}
                onOverride={() => markOverridden('fit')}
                columns={2}
              />
              <OptionSelector
                label="Size"
                options={SIZES}
                value={options.size}
                onChange={(v) => setOption('size', v)}
              />
              <DropdownPicker
                label="Target Market"
                options={TARGET_MARKETS}
                value={options.targetMarket}
                onChange={(v) => setOption('targetMarket', v)}
                columns={2}
              />

              <div className="flex items-center justify-between p-4 theme-card border theme-border shadow-sm rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-light/30 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-bold theme-text text-sm">{t('customize.options.search')}</p>
                    <p className="text-[10px] theme-text-sec">{t('customize.options.search.desc')}</p>
                  </div>
                </div>
                <Switch
                  checked={options.useSearchGrounding}
                  onChange={(v) => setOption('useSearchGrounding', v)}
                  label="Google Search Grounding"
                />
              </div>

              <div className="flex items-center justify-between p-4 theme-card border theme-border shadow-sm rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-light/30 rounded-full flex items-center justify-center">
                    <CpuIcon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-bold theme-text text-sm">{t('customize.options.cache')}</p>
                    <p className="text-[10px] theme-text-sec">{t('customize.options.cache.desc')}</p>
                  </div>
                </div>
                <Switch
                  checked={options.useCache !== false}
                  onChange={(v) => setOption('useCache', v)}
                  label="Use Cache"
                />
              </div>
            </div>
          )}
        </div>



        {/* Cost estimator */}
        <div className="mt-6">
          <CostEstimator
            mode={options.mode}
            outputCount={Number(options.outputCount || 4)}
            aiModel={options.aiModel}
            imageResolution={options.imageResolution || '1K'}
          />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Generate button */}
      <div className="fixed bottom-20 left-0 right-0 px-5 md:px-8 pb-4 max-w-screen-md mx-auto">
        <div className="backdrop-blur-xl pt-4" style={{ background: 'var(--nav-bg)' }}>
          <Button
            onClick={generate}
            disabled={images.length === 0}
            className="w-full"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>{t('customize.button.generate')}</span>
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
