class Task < ActiveRecord::Base
  attr_accessible :id, :name, :owner, :status
end
