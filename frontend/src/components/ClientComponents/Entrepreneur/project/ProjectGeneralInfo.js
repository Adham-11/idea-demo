import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Input = styled.input`
  width: 100%;
  padding: 15px 18px;
  border: 1.5px solid #e3e8f0;
  border-radius: 9px;
  background: #fff;
  font-size: 1.08rem;
  margin-bottom: 24px;
  outline: none;
  color: #222;
  &::placeholder {
    color: #b6c6e3;
    opacity: 1;
    font-weight: 400;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 0;
`;

const Select = styled.select`
  width: 100%;
  padding: 15px 18px;
  border: 1.5px solid #e3e8f0;
  border-radius: 9px;
  font-size: 1.08rem;
  margin-bottom: 24px;
  outline: none;
  color: #222;
`;

const countries = [
  "United States", "Canada", "United Kingdom", "Germany", "France",
  "Egypt", "India", "Australia", "Brazil", "China", "Japan"
];

const industryOptions = [
  'Agriculture', 'Entertainment & Leisure', 'Food & Beverage', 'Media',
  'Products & Inventions', 'Sales & Marketing', 'Transportation', 'Software',
  'Education & Training', 'Fashion & Beauty', 'Hospitality, Restaurants & Bars',
  'Energy & Natural Resources', 'Medical & Sciences', 'Finance',
  'Manufacturing & Engineering', 'Personal Services', 'Property', 'Retail',
  'Technology', 'Business Services'
];

function ProjectGeneralInfo({
  form,
  setForm,
  isEditMode,
  Title,
  Label,
  ButtonRow,
  Button,
  setStep,
  step,
  handleNextStep, 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const dealTypeOptions = [
    { id: "deal-type-equity", value: "equity", label: "Equity" },
    { id: "deal-type-debt", value: "debt", label: "Debt" },
    { id: "deal-type-MutualFunds", value: "Mutual Funds", label: "Mutual Funds" }
  ];

  const handleCheckboxChange = (value) => {
    setForm((prevForm) => {
      const currentDealTypes = prevForm.dealType || [];
      const updatedDealTypes = currentDealTypes.includes(value)
        ? currentDealTypes.filter((type) => type !== value)
        : [...currentDealTypes, value];
      console.log('Updated dealType:', updatedDealTypes); // Debug state
      return { ...prevForm, dealType: updatedDealTypes };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <>
      <Title>{isEditMode ? "Edit General Information" : "General Information"}</Title>
      {form.projectName && form.projectName.length < 3 && (
        <span style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
          Project Name must be at least 3 characters
        </span>
      )}
      <Label>Project Name <span style={{ color: 'red' }}>*</span></Label>
      <Input
        name="projectName"
        value={form.projectName}
        onChange={handleChange}
        placeholder="Enter your project name"
        required
      />
      {form.website && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(form.website) && (
        <span style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
          Website must be a valid URL (e.g., https://example.com)
        </span>
      )}
      <Label>Website Link</Label>
      <Input
        name="website"
        value={form.website}
        onChange={handleChange}
        placeholder="https://example.com"
      />
      <Row>
        <div style={{ flex: 1 }}>
          {form.minInvestment && (isNaN(parseFloat(form.minInvestment.replace(/[^0-9.]/g, ''))) || form.minInvestment.replace(/[^0-9.]/g, '').match(/\./g)?.length > 1) && (
            <span style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
              Minimum per Investment must be a valid number (e.g., 1000 or 1000.50)
            </span>
          )}
          <Label>Minimum per Investment in EGP <span style={{ color: 'red' }}>*</span></Label>
          <Input
            name="minInvestment"
            type="text"
            value={form.minInvestment}
            onChange={handleChange}
            placeholder="100000"
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          {form.maxInvestment && (isNaN(parseFloat(form.maxInvestment.replace(/[^0-9.]/g, ''))) || form.maxInvestment.replace(/[^0-9.]/g, '').match(/\./g)?.length > 1) && (
            <span style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
              Target Investment must be a valid number (e.g., 1000 or 1000.50)
            </span>
          )}
          <Label>Target Investment in EGP <span style={{ color: 'red' }}>*</span></Label>
          <Input
            name="maxInvestment"
            type="text"
            value={form.maxInvestment}
            onChange={handleChange}
            placeholder="1000000"
            required
          />
        </div>
      </Row>
      {form.networth && (isNaN(parseFloat(form.networth.replace(/[^0-9.]/g, ''))) || form.networth.replace(/[^0-9.]/g, '').match(/\./g)?.length > 1) && (
        <span style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
          Net Worth must be a valid number (e.g., 500000 or 500000.50)
        </span>
      )}
      <Label>Net Worth <span style={{ color: 'red' }}>*</span></Label>
      <Input
        name="networth"
        type="text"
        value={form.networth}
        onChange={handleChange}
        placeholder="500000"
        required
      />
      {form.industry && !industryOptions.includes(form.industry) && (
        <span style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
          Please select a valid industry
        </span>
      )}
      <Label>Project Industry</Label>
      <Select
        name="industry"
        value={form.industry}
        onChange={handleChange}
        required
      >
        <option value="">Select an industry</option>
        {industryOptions.map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </Select>
      {form.project_location && !countries.includes(form.project_location) && (
        <span style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
          Please select a valid country
        </span>
      )}
      <Label>Project Location</Label>
      <Select
        name="project_location"
        value={form.project_location}
        onChange={handleChange}
        required
      >
        <option value="">Select a country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </Select>
      <Row>
        <div style={{ flex: 1 }}>
          <Label>City</Label>
          <Input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div style={{ flex: 1 }}>
          <Label>District</Label>
          <Input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State/Province"
          />
        </div>
        <div style={{ flex: 1 }}>
          <Label>Zip / Postal Code</Label>
          <Input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            placeholder="Zip/Postal Code"
          />
        </div>
      </Row>
      <Row>
        <div style={{ flex: 1 }}>
          <Label>Deal Type <span style={{ color: 'red' }}>*</span></Label>
          <button
            id="dropdownHelperButton"
            data-dropdown-toggle="dropdownHelper"
            className="
              text-black
              bg-white
              hover:bg-gray-100
              focus:ring-4
              focus:outline-none
              focus:ring-blue-300
              font-medium
              rounded-lg
              text-sm
              px-5
              py-2.5
              text-left
              inline-flex
              items-center
              border
              border-gray-300
              w-full
              justify-between"
            type="button"
            onClick={toggleDropdown}
          >
            Select Deal Type
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdownHelper"
            className={`z-10 ${isDropdownOpen ? '' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600 absolute mt-1 max-h-64 overflow-y-auto`}
          >
            <ul
              className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownHelperButton"
            >
              {dealTypeOptions.map((option) => (
                <li key={option.id}>
                  <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex items-center h-5">
                      <input
                        id={option.id}
                        type="checkbox"
                        value={option.value}
                        checked={form.dealType.includes(option.value)}
                        onChange={() => handleCheckboxChange(option.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500"
                      />
                    </div>
                    <div className="ms-2 text-sm">
                      <label
                        htmlFor={option.id}
                        className="font-medium text-gray-900 dark:text-gray-200"
                      >
                        <div>{option.label}</div>
                        <p
                          id={`${option.id}-text`}
                          className="text-xs font-normal text-gray-500 dark:text-gray-300"
                        >
                          Select {option.label} deal type
                        </p>
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {form.stage && !['Seed', 'Launch', 'Growth'].includes(form.stage) && (
            <span style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
              Please select a valid stage
            </span>
          )}
          <Label>Project Stage <span style={{ color: 'red' }}>*</span></Label>
          <Select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a stage</option>
            <option value="Seed">Seed</option>
            <option value="Launch">Launch</option>
            <option value="Growth">Growth</option>
          </Select>
        </div>
      </Row>
      <ButtonRow>
        <Button onClick={() => setStep(step - 1)} disabled={step === 0}>Back</Button>
        <Button primary onClick={handleNextStep}>Next</Button>
      </ButtonRow>
    </>
  );
}

ProjectGeneralInfo.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  Title: PropTypes.elementType.isRequired,
  Label: PropTypes.elementType.isRequired,
  ButtonRow: PropTypes.elementType.isRequired,
  Button: PropTypes.elementType.isRequired,
  setStep: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired
};

export default ProjectGeneralInfo;