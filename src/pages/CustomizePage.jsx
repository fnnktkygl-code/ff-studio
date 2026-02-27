import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/common/Button'
import { OptionSelector } from '../components/customize/OptionSelector'
import { GenerationModeToggle } from '../components/customize/GenerationModeToggle'
import { CostEstimator } from '../components/customize/CostEstimator'
import { ImagePreview } from '../components/upload/ImagePreview'
import { useGenerationStore } from '../stores/generationStore'
import { useGenerate } from '../hooks/useGenerate'
import { useImageUpload } from '../hooks/useImageUpload'
import {
  MODEL_TYPES, ETHNICITIES, ENVIRONMENTS, GARMENT_TYPES,
  PRODUCT_STYLES, BRAND_STYLES, FABRICS, FITS, SIZES, TARGET_MARKETS, OUTPUT_COUNTS,
  AI_MODEL_OPTIONS, HEADWEAR_OPTIONS, VIDEO_MODEL_OPTIONS,
} from '../utils/constants'

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

export function CustomizePage() {
  const navigate = useNavigate()
  const { generate } = useGenerate()
  const { inputRef, openPicker, handleInputChange } = useImageUpload()

  const images = useGenerationStore((s) => s.images)
  const options = useGenerationStore((s) => s.options)
  const error = useGenerationStore((s) => s.error)
  const setOption = useGenerationStore((s) => s.setOption)
  const removeImage = useGenerationStore((s) => s.removeImage)

  if (images.length === 0) {
    navigate('/')
    return null
  }

  return (
    <PageTransition>
      <Header title="Customize" showBack />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-44">
        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-sm text-red-400">
            <span>{error}</span>
          </div>
        )}

        {/* Source images */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
            Source Images ({images.length}/4)
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
                <span className="text-[9px] font-bold mt-1">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Model Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-1 mb-3">
            <CpuIcon className="w-4 h-4 text-brand" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest theme-text-muted">AI Model</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {AI_MODEL_OPTIONS.map((model) => {
              const isActive = options.aiModel === model.value
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
                  <span className={`text-[10px] ${isActive ? 'text-brand-dark/70' : 'theme-text-sec'}`}>{model.sublabel}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Generation Mode */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 px-1 theme-text-muted">
            Output Mode
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
          <OptionSelector
            label="Garment Type"
            options={GARMENT_TYPES}
            value={options.garmentType}
            onChange={(v) => {
              setOption('garmentType', v)
            }}
          />

          {(options.mode === 'model' || options.mode === 'both') && (
            <>
              <OptionSelector
                label="Model"
                options={MODEL_TYPES}
                value={options.modelType}
                onChange={(v) => setOption('modelType', v)}
              />
              <OptionSelector
                label="Ethnicity / Origin"
                options={ETHNICITIES}
                value={options.ethnicity}
                onChange={(v) => setOption('ethnicity', v)}
              />

              {/* Hijab / Headwear: Hide or disable for skirts and shorts */}
              {!['skirt', 'shorts'].includes(options.garmentType) && (
                <OptionSelector
                  label="Headwear (Modesty)"
                  options={HEADWEAR_OPTIONS}
                  value={options.headwear}
                  onChange={(v) => setOption('headwear', v)}
                />
              )}
            </>
          )}

          {(options.mode === 'product' || options.mode === 'both') && (
            <OptionSelector
              label="Product Style"
              options={PRODUCT_STYLES}
              value={options.productStyle}
              onChange={(v) => setOption('productStyle', v)}
            />
          )}

          <OptionSelector
            label="Environment"
            options={ENVIRONMENTS}
            value={options.environment}
            onChange={(v) => setOption('environment', v)}
          />
        </div>

        {/* Advanced Options */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
          <div className="flex items-center gap-2 px-1 mb-2">
            <SparklesIcon className="w-4 h-4 text-brand" />
            <h3 className="text-xs font-bold uppercase tracking-widest theme-text-muted">Advanced</h3>
          </div>

          <OptionSelector
            label="Brand Inspiration"
            options={BRAND_STYLES}
            value={options.brandStyle}
            onChange={(v) => setOption('brandStyle', v)}
          />
          <OptionSelector
            label="Fabric"
            options={FABRICS}
            value={options.fabric}
            onChange={(v) => setOption('fabric', v)}
          />
          <OptionSelector
            label="Fit"
            options={FITS}
            value={options.fit}
            onChange={(v) => setOption('fit', v)}
          />
          <OptionSelector
            label="Size"
            options={SIZES}
            value={options.size}
            onChange={(v) => setOption('size', v)}
          />
          <OptionSelector
            label="Target Market"
            options={TARGET_MARKETS}
            value={options.targetMarket}
            onChange={(v) => setOption('targetMarket', v)}
          />

          <div className="flex items-center justify-between p-4 theme-card border theme-border shadow-sm rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-light/30 rounded-full flex items-center justify-center">
                <CpuIcon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="font-bold theme-text text-sm">Use Cache</p>
                <p className="text-[10px] theme-text-sec">Reuse recent identical results instantly</p>
              </div>
            </div>
            <button
              onClick={() => setOption('useCache', !options.useCache)}
              className={`w-12 h-7 rounded-full transition-colors relative ${options.useCache !== false ? 'bg-gradient-to-r from-brand-dark to-brand' : 'bg-slate-200'
                }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow ${options.useCache !== false ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>
        </div>

        {/* Video Options */}
        {(options.mode === 'model' || options.mode === 'both') && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between p-4 theme-card border theme-border shadow-sm rounded-2xl mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-light/30 rounded-full flex items-center justify-center">
                  <FilmIcon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-bold theme-text text-sm">Cinematic Video</p>
                  <p className="text-[10px] theme-text-sec">Animate the best image generated</p>
                </div>
              </div>
              <button
                onClick={() => setOption('generateVideo', !options.generateVideo)}
                className={`w-12 h-7 rounded-full transition-colors relative ${options.generateVideo ? 'bg-gradient-to-r from-brand-dark to-brand' : 'bg-slate-200'
                  }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow ${options.generateVideo ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </button>
            </div>

            {options.generateVideo && (
              <div className="grid grid-cols-1 gap-2">
                {VIDEO_MODEL_OPTIONS.map((model) => {
                  const isActive = options.videoModel === model.value
                  return (
                    <button
                      key={model.value}
                      onClick={() => setOption('videoModel', model.value)}
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
                      <span className={`text-[10px] ${isActive ? 'text-brand-dark/70' : 'theme-text-sec'}`}>{model.sublabel}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Cost estimator */}
        <div className="mt-6">
          <CostEstimator
            mode={options.mode}
            generateVideo={options.generateVideo}
            outputCount={Number(options.outputCount || 4)}
            aiModel={options.aiModel}
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
      <div className="fixed bottom-20 left-0 right-0 px-5 pb-4 max-w-lg mx-auto">
        <div className="backdrop-blur-xl pt-4" style={{ background: 'var(--nav-bg)' }}>
          <Button
            onClick={generate}
            disabled={images.length === 0}
            className="w-full"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>Create Magic</span>
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
