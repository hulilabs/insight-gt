/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | '_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */
/**
 * @file Dropdown documentation page
 * @requires vue
 * @requires web-components/dropdowns/dropdown_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/dropdowns/readme.md
 * @requires pages/dropdown/dropdown-page_template.html
 * @module pages/dropdown/dropdown-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/dropdowns/dropdown_component',
    'web-components/markdown/markdown_component',
    'text!web-components/dropdowns/readme.md',
    'text!pages/dropdown/dropdown-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Dropdown,
    Markdown,
    DropdownReadme,
    Template
) {

    var DropdownPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : DropdownReadme
                },
                native : true,
                setIconOnly : true,
                selectedPhoneType : 1,
                selectedPhoneTypeNative : null,
                phoneTypeAltPlaceholder : 'Seleccione un tipo de teléfono',
                phoneTypeDropdownId : 'phoneTypeDropdown',
                phoneTypeOptions : [
                    {
                        text : 'Móvil',
                        value : 1,
                        iconClass : 'icon-phone-mobile'
                    },
                    {
                        text : 'Casa',
                        value : 2,
                        iconClass : 'icon-phone-home'
                    },
                    {
                        text : 'Trabajo',
                        value : 3,
                        iconClass : 'icon-phone-office'
                    },
                    {
                        text : 'Otro',
                        value : 4,
                        iconClass : 'icon-phone'
                    }
                ],
                phoneTypeLabel : 'Tipo',
                selectedProvince : 1,
                provinceAltPlaceholder : 'Seleccione una provincia',
                provinceOptions : [
                    {
                        text : 'San José',
                        value : '1'
                    },
                    {
                        text : 'Alajuela',
                        value : '2'
                    },
                    {
                        text : 'Cartago',
                        value : '3'
                    },
                    {
                        text : 'Guanacaste',
                        value : '6'
                    },
                    {
                        text : 'Heredia',
                        value : '4',
                        disabled : true
                    },
                    {
                        text : 'Limón',
                        value : '7'
                    },
                    {
                        text : 'Puntarenas',
                        value : '5'
                    }
                ],
                coloredProvinceOptions : [
                    {
                        text : 'San José',
                        value : '1',
                        color : 'yellow'
                    },
                    {
                        text : 'Alajuela',
                        value : '2',
                        color : 'red'
                    },
                    {
                        text : 'Cartago',
                        value : '3',
                        color : 'blue'
                    },
                    {
                        text : 'Guanacaste',
                        value : '6',
                        color : 'green'
                    },
                    {
                        text : 'Heredia',
                        value : '4',
                        color : 'orange'
                    },
                    {
                        text : 'Limón',
                        value : '7',
                        color : 'cyan'
                    },
                    {
                        text : 'Puntarenas',
                        value : '5',
                        color : 'purple'
                    }
                ],
                provinceLabel : 'Provincia',
                provinceDropdownErrorMsg : 'Error en el campo de provincia',
                longTextOptions : [
                    {
                        text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                        value : 1
                    },
                    {
                        text : 'Suspendisse condimentum imperdiet tristique. Suspendisse porta finibus velit, sed vehicula justo efficitur non.',
                        value : 2
                    },
                    {
                        text : 'Lorem ipsum dolor',
                        value : 3
                    }
                ],
                footballTeamsAltPlaceholder : 'Provincia con mejor equipo',
                footballTeamsPerProvince : [
                    {
                        text : 'Alajuela',
                        value : '2',
                        hint : '(L.D.A)'
                    },
                    {
                        text : 'Cartago',
                        value : '3',
                        hint : '(C.S.C)'
                    },
                    {
                        text : 'Guanacaste',
                        value : '6',
                        hint : '(Liberia)'
                    },
                    {
                        text : 'Heredia',
                        value : '4',
                        hint : '(C.S.H)'
                    },
                    {
                        text : 'Limón',
                        value : '7',
                        hint : '(Limón F.C)'
                    },
                    {
                        text : 'Puntarenas',
                        value : '5',
                        hint : '(Puntarenas F.C)'
                    },
                    {
                        text : 'San José',
                        value : '1',
                        hint : '(Saprissa)'
                    }
                ],
                appointments : [
                    {
                        text : 'Mie 12 de abril 2:00p.m',
                        value : '1',
                        secondaryText : 'Clinic 1'
                    },
                    {
                        text : 'Jue 13 de abril 2:00p.m',
                        value : '2',
                        secondaryText : 'Clinic 1'
                    },
                    {
                        text : 'Lun 10 de abril 2:00p.m',
                        value : '3',
                        secondaryText : 'Clinic 1'
                    },
                    {
                        text : 'Mar 11 de abril 2:00p.m',
                        value : '4',
                        secondaryText : 'Clinic 1'
                    },
                    {
                        text : 'Vie 14 de abril 2:00p.m',
                        value : '5',
                        secondaryText : 'Clinic 1'
                    },
                    {
                        text : 'Sab 15 de abril 2:00p.m',
                        value : '6',
                        secondaryText : 'Clinic 1'
                    },
                    {
                        text : 'Dom 16 de abril 2:00p.m',
                        value : '7',
                        secondaryText : 'Clinic 1'
                    },
                ],
                selectedAvatar : 1,
                avatarLabel : 'Avatar',
                avatarAltPlaceholder : 'Selecciona una opción con Avatar',
                avatars : [
                    {
                        text : 'Option with Avatar 1',
                        value : 1,
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Option with Avatar 2',
                        value : 2,
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Option with Avatar 3',
                        value : 3,
                        avatar : '/site/img/doctor-male.svg'
                    }
                ],
                selectedAppointment : null,
                disabled : true,
                floatingLabel : true,
                hasError : true
            };
        },

        methods : {
            deleteFirstProvince : function() {
                this.provinceOptions.splice(0, 1);
            }
        },

        components : {
            'wc-dropdown' : Dropdown,
            'wc-markdown' : Markdown
        }
    });

    return DropdownPage;
});
