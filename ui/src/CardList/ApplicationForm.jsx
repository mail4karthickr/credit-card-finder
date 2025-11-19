import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  overflow-y: auto;
`;

const FormContainer = styled.div`
  background: transparent;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin: 20px auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(211, 47, 47, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(211, 47, 47, 0.5);
    }
  }
`;

const Header = styled.div`
  position: relative;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  padding: 24px 32px;
  padding-right: 72px; /* Make space for close button */
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const CardImageSmall = styled.img`
  width: 120px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const HeaderText = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Subtitle = styled.div`
  font-size: 1rem;
  opacity: 0.95;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
  z-index: 20;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.95);
  }
`;

const FormContent = styled.form`
  padding: 32px;
  background: white;
  border-radius: 0 0 12px 12px;
`;

const Section = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 16px;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #d32f2f;
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #d32f2f;
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #999;
  color: #999;
  font-size: 0.75rem;
  cursor: help;
`;

const HelpText = styled.div`
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  margin-top: 4px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #d32f2f;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Link = styled.a`
  color: #d32f2f;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
`;

const Button = styled.button`
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.variant === 'secondary' ? '#d32f2f' : 'transparent'};
  background: ${props => props.variant === 'secondary' ? 'white' : '#d32f2f'};
  color: ${props => props.variant === 'secondary' ? '#d32f2f' : 'white'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const BulletList = styled.ul`
  list-style: disc;
  padding-left: 24px;
  margin: 12px 0;
  
  li {
    font-size: 0.9rem;
    color: #555;
    line-height: 1.6;
    margin-bottom: 8px;
  }
`;

const ApplicationForm = ({ card, onClose, cardImage }) => {
  const [formData, setFormData] = useState({
    // Personal info
    firstName: '',
    middleInitial: '',
    lastName: '',
    suffix: '',
    ssn: '',
    dateOfBirth: '',
    
    // Contact info
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    citizenship: '',
    mobileNumber: '',
    email: '',
    
    // Security info
    mothersMaidenName: '',
    
    // Financial info
    housingStatus: '',
    employmentStatus: '',
    totalAnnualIncome: '',
    nonTaxableIncome: false,
    
    // Card options
    addAuthorizedUser: false,
    
    // Terms
    consentElectronicDelivery: false,
    consentMobileInfo: false,
    readCertifications: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would submit to your backend
    console.log('Application submitted:', formData);
    alert('Application submitted successfully! (Demo only)');
    onClose();
  };
  
  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.ssn && 
           formData.dateOfBirth &&
           formData.readCertifications;
  };
  
  return (
    <Overlay onClick={onClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          {cardImage && <CardImageSmall src={cardImage} alt={card.title} />}
          <HeaderText>
            <Title>Applying for the {card.title}</Title>
            <Subtitle>{card.subtitle || 'Complete your application below'}</Subtitle>
          </HeaderText>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        
        <FormContent onSubmit={handleSubmit}>
          {/* Start Application Section */}
          <Section>
            <SectionTitle>Let's start your application</SectionTitle>
            <CheckboxLabel>
              <Checkbox 
                name="prefill"
                onChange={() => {}}
              />
              <span>Sign on to prefill your application</span>
            </CheckboxLabel>
          </Section>
          
          {/* About You Section */}
          <Section>
            <SectionTitle>About you</SectionTitle>
            
            <FormRow>
              <FormGroup>
                <Label>
                  First name
                  <InfoIcon title="Legal first name">ⓘ</InfoIcon>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Middle initial (optional)</Label>
                <Input
                  type="text"
                  name="middleInitial"
                  maxLength="1"
                  value={formData.middleInitial}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label>Last name</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Suffix (optional)</Label>
                <Select
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label>
                  SSN/ITIN
                  <InfoIcon title="Social Security Number or Individual Taxpayer Identification Number">ⓘ</InfoIcon>
                </Label>
                <Input
                  type="text"
                  name="ssn"
                  placeholder="XXX-XX-XXXX"
                  value={formData.ssn}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Date of birth</Label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>
          </Section>
          
          {/* Contact Information Section */}
          <Section>
            <SectionTitle>Contact information</SectionTitle>
            
            <FormRow columns="2fr 1fr">
              <FormGroup>
                <Label>
                  Home or permanent address
                  <InfoIcon title="Physical address where you reside">ⓘ</InfoIcon>
                </Label>
                <Input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Address line 2 (optional)</Label>
                <Input
                  type="text"
                  name="address2"
                  placeholder="Apt, suite, etc."
                  value={formData.address2}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>State</Label>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select state</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label>ZIP code</Label>
                <Input
                  type="text"
                  name="zipCode"
                  placeholder="XXXXX"
                  maxLength="5"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Citizenship</Label>
                <Select
                  name="citizenship"
                  value={formData.citizenship}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="US Citizen">U.S. Citizen</option>
                  <option value="Permanent Resident">Permanent Resident</option>
                  <option value="Other">Other</option>
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label>Mobile number</Label>
                <Input
                  type="tel"
                  name="mobileNumber"
                  placeholder="(XXX) XXX-XXXX"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
                <HelpText>
                  You agree that Wells Fargo may contact you at the number(s) above using automated systems. 
                  Message and data rates may apply.
                </HelpText>
              </FormGroup>
              
              <FormGroup>
                <Label>Email address</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <HelpText>
                  You give Wells Fargo consent to contact you at that email address. 
                  You can opt out of receiving marketing emails at any time.
                </HelpText>
              </FormGroup>
            </FormRow>
          </Section>
          
          {/* Security Information Section */}
          <Section>
            <SectionTitle>Security information</SectionTitle>
            
            <FormGroup>
              <Label>
                Mother's maiden name
                <InfoIcon title="Used for identity verification">ⓘ</InfoIcon>
              </Label>
              <Input
                type="text"
                name="mothersMaidenName"
                value={formData.mothersMaidenName}
                onChange={handleChange}
                style={{ maxWidth: '400px' }}
              />
            </FormGroup>
          </Section>
          
          {/* Financial Information Section */}
          <Section>
            <SectionTitle>Financial information</SectionTitle>
            
            <FormGroup style={{ marginBottom: '16px' }}>
              <Label>Housing status</Label>
              <Select
                name="housingStatus"
                value={formData.housingStatus}
                onChange={handleChange}
                required
                style={{ maxWidth: '400px' }}
              >
                <option value="">Select</option>
                <option value="Own">Own</option>
                <option value="Rent">Rent</option>
                <option value="Other">Other</option>
              </Select>
            </FormGroup>
            
            <FormGroup style={{ marginBottom: '16px' }}>
              <Label>Employment status</Label>
              <Select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                required
                style={{ maxWidth: '400px' }}
              >
                <option value="">Select</option>
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Retired">Retired</option>
                <option value="Student">Student</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Other">Other</option>
              </Select>
            </FormGroup>
            
            <FormGroup style={{ marginBottom: '16px' }}>
              <Label>
                Total annual income
                <InfoIcon title="Include all income from all sources">ⓘ</InfoIcon>
              </Label>
              <Input
                type="text"
                name="totalAnnualIncome"
                placeholder="$"
                value={formData.totalAnnualIncome}
                onChange={handleChange}
                required
                style={{ maxWidth: '400px' }}
              />
            </FormGroup>
            
            <div style={{ marginBottom: '16px' }}>
              <Label style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                Non-taxable income
                <InfoIcon title="Income exempt from U.S. Federal Income Tax">ⓘ</InfoIcon>
              </Label>
              <CheckboxLabel>
                <Checkbox
                  name="nonTaxableIncome"
                  checked={formData.nonTaxableIncome}
                  onChange={handleChange}
                />
                <span>Part of my total annual income is exempt from U.S. Federal Income Tax.</span>
              </CheckboxLabel>
            </div>
          </Section>
          
          {/* Card Options Section */}
          <Section>
            <SectionTitle>Card options</SectionTitle>
            
            <div>
              <Label style={{ marginBottom: '12px' }}>Authorized user</Label>
              <CheckboxLabel>
                <Checkbox
                  name="addAuthorizedUser"
                  checked={formData.addAuthorizedUser}
                  onChange={handleChange}
                />
                <span>Yes, I would like to add an authorized user.</span>
              </CheckboxLabel>
            </div>
          </Section>
          
          {/* Terms and Conditions Section */}
          <Section>
            <SectionTitle>Terms and conditions</SectionTitle>
            
            <div style={{ marginBottom: '24px' }}>
              <Label style={{ marginBottom: '12px', fontWeight: '600' }}>
                Consent to electronic delivery
              </Label>
              <HelpText style={{ marginBottom: '12px' }}>
                We need your consent to deliver account-opening disclosures to you electronically. 
                Please review the terms of the{' '}
                <Link href="https://www.wellsfargo.com" target="_blank" rel="noopener">
                  ESIGN Consent (PDF)
                </Link>
                . If you don't consent to receive your account-opening disclosures, you won't be able to submit this online application.
              </HelpText>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Label style={{ marginBottom: '12px', fontWeight: '600' }}>
                Consent to obtain mobile information
              </Label>
              <HelpText style={{ marginBottom: '12px' }}>
                You authorize your wireless carrier to use or disclose information about your account and your wireless device, 
                if available, to Wells Fargo, its Affiliates, or its service provider for the duration of your business relationship, 
                solely to help them identify you or your wireless device and to prevent fraud. See our{' '}
                <Link href="https://www.wellsfargo.com" target="_blank" rel="noopener">
                  Privacy Policy
                </Link>{' '}
                for how we treat your data.
              </HelpText>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Label style={{ marginBottom: '12px', fontWeight: '600' }}>
                Certifications
              </Label>
              <BulletList>
                <li>I have read and agree to the <strong>Consent to obtain mobile information</strong> terms.</li>
                <li>I have read and agree to the <strong>ESIGN Consent</strong> terms.</li>
                <li>All the information that I provided in my application is accurate.</li>
                <li>
                  I give Wells Fargo permission to request and use my income and to request a consumer report 
                  and verify credit information.
                </li>
                <li>
                  I agree to the terms and conditions and agree to be bound by the{' '}
                  <Link href="https://www.wellsfargo.com" target="_blank" rel="noopener">
                    Customer Agreement and Disclosure Statement
                  </Link>
                  , including the Arbitration Agreement and the{' '}
                  <Link href="https://www.wellsfargo.com" target="_blank" rel="noopener">
                    Privacy Notice
                  </Link>
                  . (The Arbitration Agreement may not apply to covered borrowers.)
                </li>
              </BulletList>
            </div>
            
            <CheckboxLabel>
              <Checkbox
                name="readCertifications"
                checked={formData.readCertifications}
                onChange={handleChange}
                required
              />
              <span>
                <strong>I have read and I agree to the Certifications.</strong>
              </span>
            </CheckboxLabel>
          </Section>
          
          {/* Buttons */}
          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid()}>
              Submit
            </Button>
          </ButtonGroup>
        </FormContent>
      </FormContainer>
    </Overlay>
  );
};

export default ApplicationForm;
