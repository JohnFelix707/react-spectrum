import { useState } from "react";
import { defaultTheme, Provider } from "@adobe/react-spectrum";
import User from "@spectrum-icons/workflow/User";
import UserGroup from "@spectrum-icons/workflow/UserGroup";
import Building from "@spectrum-icons/workflow/Building";
import ThemeSwitcher from "./ThemeSwitcher";
import { SelectBoxGroup, SelectBox } from "./components/SelectBoxGroup";
import { SentimentRatingGroup } from "./components/SentimentRatingGroup";
import { NavigationBox } from "./components/NavigationBox";
import { StarRatingGroup } from "./components/StarRatingGroup";
import { GenInputField } from "./components/GenInputField";
import { PlanSwitcher } from "./components/PlanSwitcher";

export function App() {
  let [colorScheme, setColorScheme] = useState(undefined);

  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <ThemeSwitcher setColorScheme={setColorScheme} />
      <h1 className="text-4xl font-bold text-center mb-300 pt-300">
        RAC + Spectrum + Tailwind Cookbook
      </h1>
      <section>
        <h2 className="text-2xl font-semibold">Intro</h2>
        <div>
          This resource is meant to help you get started with creating custom
          components using{" "}
          <a href="https://react-spectrum.adobe.com/react-aria/react-aria-components.html">
            React Aria Components
          </a>{" "}
          and <a href="https://tailwindcss.com/">Tailwind CSS</a>, with a theme
          that features uses <a href="https://spectrum.adobe.com/">Spectrum</a>{" "}
          styles.
        </div>
        <h3 className="text-xl font-semibold">When to use this</h3>
        <div>
          When you need to implement a component that follows Spectrum
          guidelines, but doesn't exist in React Spectrum.
        </div>
        <h3 className="text-xl font-semibold">When not to use this</h3>
        <div>
          When you want to avoid patterns specifically outlined by Spectrum, or
          when a React Spectrum component already exists for your use case.
        </div>
        <h3 className="text-xl font-semibold">Risks</h3>
        <div>
          Since you're taking ownership of the components you build, you still
          need to ensure they follow Spectrum guidelines and accessibility
          guidelines.
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Setup</h2>
        <ol>
          <li>
            <h3 className="text-xl font-semibold">Install dependencies</h3>
            <div>
              We need to install{" "}
              <a href="https://react-spectrum.adobe.com/react-spectrum/getting-started.html">
                React Spectrum
              </a>
              ,{" "}
              <a href="https://react-spectrum.adobe.com/react-aria/react-aria-components.html#installation">
                React Aria Components
              </a>
              , and the{" "}
              <a href="https://react-spectrum.adobe.com/react-aria/styling.html#plugin">
                RAC Tailwind plugin
              </a>
              .
            </div>
            <code className="p-40 bg-gray-200 rounded">
              yarn add @adobe/react-spectrum react-aria-components
              tailwindcss-react-aria-components
            </code>
            <div>
              Note that the reason React Spectrum is needed, is because the
              Provider will provide CSS variables that our theme will reference.
            </div>
          </li>
          <li>
            <h3 className="text-xl font-semibold">Install Tailwind</h3>
            <div>
              Follow the instructions in the{" "}
              <a href="https://tailwindcss.com/docs/installation">
                Tailwind Docs
              </a>{" "}
              based on your build setup.{" "}
            </div>
          </li>
          <li>
            <h3 className="text-xl font-semibold">Configure Tailwind</h3>
            <div>
              In your tailwind.config.js, include the preset from this template:
              <code className="block">{`
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('./src/spectrum-preset.js')
  ],
  plugins: [
    require('tailwindcss-react-aria-components')
  ],
}
`}</code>
            </div>
          </li>
          <li>Add React Spectrum Provider to app</li>
        </ol>
        <div></div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Usage</h2>
        <div>
          You can now use Tailwind classes to style your components. Examples:
          <ul>
            <li>
              Using <code className="p-40 bg-gray-200 rounded">ring</code> will
              give you a focus ring with good default Spectrum styles for it's
              color, width, and offset.
            </li>
            <li>
              Using{" "}
              <code className="p-40 bg-gray-200 rounded">bg-blue-600</code> will
              give you a background that matches
              --spectrum-global-color-blue-600.
            </li>
            <li>
              Using <code className="p-40 bg-gray-200 rounded">w-25</code> will
              give you a width of var(--spectrum-global-dimension-size-25).
            </li>
            <li>
              Using{" "}
              <code className="p-40 bg-gray-200 rounded">
                ease-in duration-100
              </code>{" "}
              will give you a transition that matches Spectrum's motion values.
            </li>
            <li>
              Using{" "}
              <code className="p-40 bg-gray-200 rounded">sm:text-left</code>{" "}
              will give you left text alignment for small width devices based on
              Spectrum's break points.
            </li>
            <li>
              Using{" "}
              <code className="p-40 bg-gray-200 rounded">dark:bg-black</code>{" "}
              will give you a black background if the user is in dark mode based
              on the React Spectrum provider.
            </li>
          </ul>
          <div>
            <h3>Styling based on state</h3>
            To see how to add Tailwind styles based on state, see the{" "}
            <a href="https://react-spectrum.adobe.com/react-aria/styling.html#tailwind-css">
              RAC Styling docs
            </a>
            .
          </div>
        </div>
      </section>
      <div className="grid justify-center grid-cols-1 gap-160 auto-rows-fr">
        <SelectBoxGroup label="Select Boxes" defaultValue="Team">
          <SelectBox
            name="Individual"
            icon={<User size="XL" />}
            description="For 1 person"
          />
          <SelectBox
            name="Team"
            icon={<UserGroup size="XL" />}
            description="For teams of 9 or less"
          />
          <SelectBox
            name="Enterprise"
            icon={<Building size="XL" />}
            description="For of 10 or more"
          />
        </SelectBoxGroup>

        <SentimentRatingGroup />

        <div className="text-center">
          <span className="text-xl font-semibold">Navigation Boxes</span>
          <div className="flex justify-center">
            <NavigationBox
              href="https://adobe.com"
              src="https://i.imgur.com/DhygPot.jpg"
            >
              Premium
            </NavigationBox>
            <NavigationBox
              href="https://adobe.com"
              src="https://i.imgur.com/Z7AzH2c.png"
            >
              Templates
            </NavigationBox>
          </div>
        </div>

        <div className="m-auto">
          <StarRatingGroup label="Star Rating" />
          <StarRatingGroup isEmphasized label="Star Rating (Emphasized)" />
        </div>

        <PlanSwitcher />

        <GenInputField />

        <div className="flex justify-center">
          <div className="flex flex-col max-w-sm">
            <label htmlFor="test-input">Native input</label>
            <input
              id="test-input"
              className="border focus:bg-gray-200 focus:outline-none focus:border-blue-600 hover:border-blue-300"
            />
            <p>
              For the purpose of ensuring Tailwind's default selectors still
              work for non-RAC elements when using the plugin.
            </p>
          </div>
        </div>
      </div>
    </Provider>
  );
}
