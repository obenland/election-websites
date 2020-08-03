const { startCase } = lodash;
const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;

const { createHigherOrderComponent } = wp.compose;

const { InspectorControls, InnerBlocks, RichText, URLInput } = wp.blockEditor;
const { PanelBody, PanelRow, SelectControl, TextControl } = wp.components;

const PARENT_BLOCK = 'ctcl-election-website/tile-nav-section-block';
const CHILD_BLOCK = 'ctcl-election-website/tile-nav-block';

const getIconEl = ( attributes ) => {
	const { icon } = attributes;
	if ( icon ) {
		const iconUrl = `${blockEditorVars.baseUrl}/${icon}.svg`;
		return createElement( 'img', {
			height: 50,
			src: iconUrl
		} );
	}
	return null;
};

registerBlockType( PARENT_BLOCK, {
	title: 'Tile Navigation',
	icon: 'screenoptions',
	category: 'election-blocks',
	edit: function( props ) {
		return createElement( 'div',
			{
				className: 'tile-nav-section-block-editor'
			},
			createElement( wp.blockEditor.InnerBlocks,
				{
					allowedBlocks: [ CHILD_BLOCK ]
				}
			)
		);
	},

	save: function( props ) {
		return createElement( 'nav',
			{
				className: 'tile-wrapper'
			},
			createElement( wp.blockEditor.InnerBlocks.Content )
		);
	}
} );

registerBlockType( CHILD_BLOCK, {
	title: 'Tile',
	icon: 'screenoptions',
	category: 'election-blocks',
	parent: [ PARENT_BLOCK ],
	attributes: {
		icon: {
			type: 'string'
		},
		label: {
			type: 'string',
			default: ''
		},
		url: {
			type: 'string'
		}
	},

	edit: function( props ) {

		function updateLabel( value ) {
			props.setAttributes( { label: value } );
		}

		function updateLink( url, post ) {
			props.setAttributes( { url: url } );
			if ( post ) {
				props.setAttributes( { label: post.title } );
			}
		}

		function updateIcon( value ) {
			props.setAttributes( { icon: value } );
		}

		const { label, icon } = props.attributes;
		const isEmpty = ! label && ! icon;

		return <div>
			<InspectorControls>
				<div className="tile-nav-settings">
					<PanelBody title="Tile" initialOpen={true}>
						<PanelRow>
							<TextControl
								label="Label"
								placeholder="Enter Label"
								onChange={updateLabel}
								value={props.attributes.label} />
						</PanelRow>
						<PanelRow>
							<URLInput
								label="Page"
								value={props.attributes.url}
								onChange={updateLink} />
						</PanelRow>
						<PanelRow>
							<SelectControl
								label="Icon"
								value={props.attributes.icon}
								options={[
									{ value: null, label: 'Select an Icon', key: '_placeholder' },
									...blockEditorVars.iconOptions.map( option => ( {
										value: option, label: startCase( option ), key: option
									} ) )
								]}
								onChange={updateIcon}
							/>
						</PanelRow>
					</PanelBody>
				</div>
			</InspectorControls>
			<div className="tile-nav-block-editor">
				<div className="tile">
					{isEmpty ? <span className="placeholder">Set tile values in control panel to your right.</span> : [
						getIconEl( props.attributes ),
						<span>{label}</span>
					]}
				</div>
			</div>
		</div>;
	},

	save: function( props ) {
		return <a className="tile" href={props.attributes.url}>
			<div className="bounding-box" id={props.attributes.icon}/>
			<span>{props.attributes.label}</span>
		</a>;
	}
} );

const withClientIdClassName = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		return <BlockListBlock { ...props } className={ 'tile-nav-block-editor-wrapper' } />;
	};
}, 'withClientIdClassName' );

wp.hooks.addFilter( 'editor.BlockListBlock', PARENT_BLOCK, withClientIdClassName );

